package Foswiki::Plugins::VueJSPlugin;

use strict;
use warnings;
use Digest::MD5 qw(md5_hex);

=begin TML
---+ package Foswiki::Plugins::VueJSPlugin
Container for Vue.JS
=cut


use Foswiki::Func ();
use Foswiki::Plugins ();
use Foswiki::OopsException ();
use Digest::MD5 qw(md5_hex);
use JSON;

our $VERSION = '0.00_001';
our $RELEASE = '0.1';
our $SHORTDESCRIPTION = 'Plugin to load VueJS dependencies.';
our $service;
our $NO_PREFS_IN_TOPIC = 1;
our $mutations;

use constant {
    STOREPLACEHOLDER => '{"placeholder":"VueJSPlugin::Store::Placeholder::78uilhayfegjlhzt3q"}',
};

sub initPlugin {
    my ($topic, $web) = @_;

    unless ( $Foswiki::cfg{Plugins}{JQueryPlugin}{Enabled} ) {
        Foswiki::Func::writeWarning(
            "VueJSPlugin is enabled but JQueryPlugin is not. Both must be installed and enabled for vue.js."
        );
        return 0;
    }

    Foswiki::Func::addToZone( 'head', 'FLATSKIN_WRAPPED',
        '<link rel="stylesheet" type="text/css" media="all" href="%PUBURLPATH%/%SYSTEMWEB%/VueJSPlugin/VueJSPlugin.min.css?version=%QUERYVERSION{"VueJSPlugin"}%" />');

    Foswiki::Func::registerTagHandler('GETVIRTUALWEB', \&tagGETVIRTUALWEB);
    Foswiki::Func::registerTagHandler('VUE', \&loadDependencies);
    Foswiki::Func::registerTagHandler('VUETOOLTIP', \&renderTooltip);
    Foswiki::Func::registerTagHandler('VUEATTACHMENTS', \&tagVUEATTACHMENTS);

    Foswiki::Func::registerRESTHandler(
        'deleteFromBlock', \&_restDeleteFromBlock,
        authenticate => 1, http_allow => 'POST', validate => 1 );

    if ($Foswiki::cfg{Plugins}{SolrPlugin}{Enabled}) {
        require Foswiki::Plugins::SolrPlugin;
        Foswiki::Plugins::SolrPlugin::registerIndexAttachmentHandler(
            \&indexAttachmentHandler
        );
    }

    return 1;
}

###############################################################################

sub renderTooltip {
    my ( $session, $params, $topic, $web, $topicObject ) = @_;
    my %vueVersion = (
        VERSION => 2
    );
    loadDependencies($session, \%vueVersion, $topic, $web, $topicObject);
    my $vueClientToken = getClientToken();
    my $html = "<div class=\"vue-container\" data-vue-client-token=\"$vueClientToken\"><vue-explanation-tooltip text=\"$params->{text}\"";
    $html .= " icon=\"$params->{icon}\"" if $params->{icon};
    $html .= "/></div>";
    return $html;
}

sub loadDependencies {
    my ( $session, $params, $topic, $web, $topicObject ) = @_;

    my $pluginURL = '%PUBURL%/%SYSTEMWEB%/VueJSPlugin';
    my $dev = $Foswiki::cfg{Plugins}{VueJSPlugin}{UseSource} || 1;
    my $suffix = $dev ? '' : '.min';
    my $version = $params->{VERSION} || "1";

    my $vueScripts = "";

    # Version 2 will become the new default. v1 is just there for compatibility.
    if($version eq "2"){
        $vueScripts = "<script type='text/javascript' src='$pluginURL/VueJSPlugin$suffix.js'></script>";
    }
    else {
        $vueScripts = "<script type='text/javascript' src='$pluginURL/vue.v1$suffix.js'></script>"
    }

    my $storeScript = '<script class="$zone $id VueJSPluginStoreData" id="VueJSPluginStoreData" type="text/json">' . STOREPLACEHOLDER . '</script>';
    Foswiki::Func::addToZone( "script", "VUEJSPLUGIN::STOREDATA", $storeScript );

    Foswiki::Plugins::JQueryPlugin::createPlugin('jqp::moment', $session);
    Foswiki::Func::addToZone( 'script', 'VUEJSPLUGIN', $vueScripts, 'JQUERYPLUGIN::JQP::MOMENT,VUEJSPLUGIN::STOREDATA');

    if(_documentIsSet()) {
        return "";
    }
    my $document = _collectDocumentData($session, $web, $topic);
    pushToStore('Qwiki/Document/setDocument', $document);

    return "";
}

sub _documentIsSet {
    if($mutations->{'Qwiki/Document'}) {
        return 1;
    }
    return 0;
}

sub _collectDocumentData {
    my ($session, $web, $topic) = @_;
    my ($topicObject) = Foswiki::Func::readTopic($web, $topic);

    my ($lastEditDate, $lastEditor, $revision) = $topicObject->getRevisionInfo();
    my $firstMeta = Foswiki::Meta->load($session, $web, $topic, 1);
    my ($creationDate, $creator) = $firstMeta->getRevisionInfo();
    my %typeData;

    return "" unless $topicObject->getFormName();

    my $form = Foswiki::Form->new($session, $web, $topicObject->getFormName());
    my @metaFields = $topicObject->find('FIELD');
    foreach my $field (@metaFields) {
        my $formField = $form->getField($field->{name});
        if($formField->{type} =~ m/user/) {
            my $users = _getUserObjectsByCuids($session, $field->{value});
            $typeData{$field->{name}} = $users;
        } else {
            $typeData{$field->{name}} = $field->{value};
        }
    }

    return {
        web => $web,
        topic => $topic,
        creator => _getUserObjectsByCuids($session, $creator),
        creationDate => $creationDate,
        lastEditor => _getUserObjectsByCuids($session, $lastEditor),
        lastEditDate => $lastEditDate,
        revision => $revision,
        text => '',
        typeData => \%typeData,
    };
}

sub _getUserObjectsByCuids {
    my ($session, $userString) = @_;

    my @userCuids= split(/\s*,\s*/, $userString);
    my @users;
    foreach my $userId (@userCuids) {
        push @users, {
            displayName => _getUserDisplayName($session, $userId),
            type => 'user',
            guid => $userId,
        };
    }
    return \@users;
}

sub _getUserDisplayName {
    my ($session, $cuid) = @_;
    my $mapper = $session->{users}->{mapping};
    return $mapper->getDisplayName($cuid);
}
sub getClientToken {
    my $clientToken = md5_hex(rand);
    # render token directly instead of using afterCommonTagsHandler
    # for more read developer supplement at Foswiki:Development.AddToZoneFromPluginHandlers
    Foswiki::Func::addToZone( 'head', 'VUEJS::TOKEN::' . substr($clientToken, - 8),
      "<script type=\"application/json\" class=\"vue-client-registrations\">{\"token\": \"$clientToken\"}</script>"
    );
    return $clientToken;
}

sub _loadTemplate {
    my  ($text) = @_;
    my @components = ( $text =~ /TMPL:DEF\{"([^"]+)"\}/g);
    my $snippet;
    foreach my $component (@components) {
        $snippet .= "<script id='$component' type='x-template'>\n%TMPL:P{\"$component\"}%\n</script>\n";
    }
    return $snippet;
}

sub tagGETVIRTUALWEB {
    my($session, $params, $topic, $web, $meta) = @_;

    if($params->{_DEFAULT}) {
        ($web, $topic) = Foswiki::Func::normalizeWebTopicName($web, $params->{_DEFAULT});
    }

    my $formatYes = $params->{formatYes};
    $formatYes = '$web' unless defined $formatYes;

    my $formatNo = $params->{formatNo};
    $formatNo = '' unless defined $formatNo;

    my $resultWeb;
    my $resultFormat;
    if($session->{store}->can('getVirtualWeb')) {
        $resultWeb = $session->{store}->getVirtualWeb($web, $topic);
        if($web ne $resultWeb) {
            if($resultWeb =~ m#^_#) {
                $resultFormat = $params->{formatHidden};
                $resultFormat = $formatYes unless defined $resultFormat;
            } else {
                $resultFormat = $formatYes;
            }
        } else {
            $resultFormat = $formatNo;
        }
    } else {
        $resultWeb = $web;
        $resultFormat = $formatNo;
    }

    $resultFormat =~ s#\$web#$resultWeb#g;
    return Foswiki::Func::decodeFormatTokens($resultFormat);
}

sub tagVUEATTACHMENTS {
    my($session, $params, $topic, $web, $meta) = @_;

    my $block = $params->{_DEFAULT} || '';
    my @attachments = $meta->find('FILEATTACHMENT');
    if($block) {
        @attachments = grep{ defined $_->{block} && $_->{block} eq $block } @attachments;
    }
    @attachments = sort{$a->{date} <=> $b->{date}} @attachments;

    my $readonly = $params->{readonly};
    $readonly ||= (Foswiki::Func::checkAccessPermission('CHANGE', $session->{user}, undef, $topic, $web) ? 0 : 1);

    my $json = to_json(\@attachments);
    $json =~ s#&#&amp;#g;
    $json =~ s#"#&quot;#g;

    my $attachmentNameFilter = $Foswiki::cfg{AttachmentNameFilter};
    $attachmentNameFilter =~ s#&#&amp;#g;
    $attachmentNameFilter =~ s#"#&quot;#g;

    my $wlaIntegration = '';
    if($Foswiki::cfg{Plugins}{WhitelistAttachmentPlugin}{Enabled}) {
        $wlaIntegration = $Foswiki::cfg{Plugins}{WhitelistAttachmentPlugin}{AllowedExtensions};
        $wlaIntegration =~ s#\.##g;
        $attachmentNameFilter =~ s#&#&amp;#g;
        $attachmentNameFilter =~ s#"#&quot;#g;
        $wlaIntegration = "extensions=\"$wlaIntegration\"";
    }

    my $vueClientToken = getClientToken();
    return "<literal><div class=\"flatskin-wrapped vue-container vue-attachments-wrapper\" data-vue-client-token=\"$vueClientToken\"><vue-attachments attachments-json=\"$json\" web=\"$web\" topic=\"$topic\" block=\"$block\" readonly=\"$readonly\" attachment-name-filter=\"$attachmentNameFilter\" $wlaIntegration></vue-attachments></div></literal>";
}

sub beforeAttachHandler {
    my ($web, $topic, $attachmentName, $opts) = @_;
    return beforeUploadHandler($opts, $topic, $web);
}

sub _restDeleteFromBlock {
    my ($session) = @_;

    my $query = Foswiki::Func::getCgiQuery();

    my ($web, $topic) = Foswiki::Func::normalizeWebTopicName(undef, $query->param('webtopic'));
    my $filename = $query->param('filename');
    my ($meta) = Foswiki::Func::readTopic($web, $topic);
    my $attachment = $meta->get('FILEATTACHMENT', $filename);
    unless($attachment) {
        Foswiki::Func::writeWarning("Attachment not found: '$filename'\@'" . $query->param('webtopic') ."'");
        throw Foswiki::OopsException(
            "oopsgeneric",
            web => $web,
            topic => $topic,
            def => 'TopicNotFound',
            params => [],
        );
    }
    $attachment->{block} = 'deleted';
    $meta->put('FILEATTACHMENT', $attachment);
    $meta->saveAs();
}

sub pushToStore {
    my ($mutation, $payload) = @_;

    my $namespace = $mutation =~ s#(.*)/.*#$1#r;
    $mutations->{$namespace} ||= [];
    push @{$mutations->{$namespace}}, {mutation => $mutation, payload => $payload};
}

sub completePageHandler {
    my $json = JSON::to_json( $mutations );
    my $base64 = MIME::Base64::encode($json);

    my $STOREPLACEHOLDER = STOREPLACEHOLDER;
    $_[0] =~ s#$STOREPLACEHOLDER#$base64#g;
}

sub beforeUploadHandler {
    my( $attrHashRef, $topic, $web ) = @_;

    my $query = Foswiki::Func::getCgiQuery();

    my $block = $query->param('block');
    $attrHashRef->{block} = $block if $block;

    my $presentedName = $query->param('presented_name');
    $attrHashRef->{presented_name} = $presentedName if $presentedName;
}

sub indexAttachmentHandler {
    my ($indexer, $doc, $web, $topic, $attachment) = @_;

    if($attachment->{presented_name}) {
        my $title = $attachment->{presented_name};

        # emulate SolrPlugins behaviour with the title
        if ($title =~ /^(.+)\.(\w+?)$/) {
            $title = $1;
        }
        $title =~ s/_+/ /g;
        $doc->change_or_add_value('title', $title);
        $doc->change_or_add_value('title_escaped_s', $indexer->escapeHtml($title));

        $doc->add_fields(
            'presented_name_s' => $attachment->{presented_name},
            'presented_name_escaped_s' => $indexer->escapeHtml($attachment->{presented_name}),
        );
    }
}

1;
