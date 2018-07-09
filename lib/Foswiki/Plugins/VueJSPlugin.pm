package Foswiki::Plugins::VueJSPlugin;

use strict;
use warnings;

=begin TML
---+ package Foswiki::Plugins::VueJSPlugin
Container for Vue.JS
=cut


use Foswiki::Func ();
use Foswiki::Plugins ();
use Digest::MD5 qw(md5_hex);

our $VERSION = '0.00_001';
our $RELEASE = '0.1';
our $SHORTDESCRIPTION = 'Plugin to load VueJS dependencies.';
our $service;
our $NO_PREFS_IN_TOPIC = 1;

sub initPlugin {
    my ($topic, $web) = @_;
    unless ( $Foswiki::cfg{Plugins}{JQueryPlugin}{Enabled} ) {
        Foswiki::Func::writeWarning(
            "VueJSPlugin is enabled but JQueryPlugin is not. Both must be installed and enabled for vue.js."
        );
        return 0;
    }
    Foswiki::Func::registerTagHandler('VUE', \&loadDependencies);
    Foswiki::Func::registerTagHandler('VUETOOLTIP', \&renderTooltip);

  return 1;
}

###############################################################################

sub renderTooltip {
    my ( $session, $params, $topic, $web, $topicObject ) = @_;
    my $instatiateVueContainerScript = <<SCRIPT;
        <script type='text/javascript'>
            \$(document).ready( function () {
            Vue.instantiateEach('.vue-container');
            });
         </script>
SCRIPT
    Foswiki::Func::addToZone( 'script', 'MOREFORMFIELDS::LOAD::VUE', $instatiateVueContainerScript , 'VUEJSPLUGIN');
    my %vueVersion = (
        VERSION => 2
    );
    loadDependencies($session, \%vueVersion, $topic, $web, $topicObject);
    my $vueClientToken = getClientToken();
    return <<HTML;
        <div class=\"flatskin-wrapped vue-container\" data-vue-client-token=\"$vueClientToken\">
            <vue-tooltip text=\"$params->{text}\"/>
        </div>
HTML
}

sub loadDependencies {

    my ( $session, $params, $topic, $web, $topicObject ) = @_;
    my $pluginURL = '%PUBURL%/%SYSTEMWEB%/VueJSPlugin';
    my $dev = $Foswiki::cfg{Plugins}{VueJSPlugin}{UseSource} || 1;
    my $suffix = $dev ? '' : '.min';
    my $version = $params->{VERSION} || "1";

    my $app = $params->{_DEFAULT} || "";
    my $vueScripts = "";

    # Version 2 will become the new default. v1 is just there for compatibility.
    if($version eq "2"){
        $vueScripts = "<script type='text/javascript' src='$pluginURL/VueJSPlugin$suffix.js'></script>";
    }
    else {
        $vueScripts = "<script type='text/javascript' src='$pluginURL/vue.v1$suffix.js'></script>"
    }

    Foswiki::Plugins::JQueryPlugin::createPlugin('jqp::moment', $session);
    Foswiki::Contrib::FontAwesomeContrib::addToZone();
    Foswiki::Func::addToZone( 'script', 'VUEJSPLUGIN', $vueScripts, 'JQUERYPLUGIN::JQP::MOMENT');

    my $scripts = "";
    my $return = "";
    if($app){
        $scripts = <<LOAD;
<script type='text/javascript' src='$pluginURL/$app$suffix.js'></script>
<link rel='stylesheet' type='text/css' href='$pluginURL/$app$suffix.css' />
LOAD

        my ($meta, $text) = Foswiki::Func::readTopic('System', $app .'VueTemplate');
        $return .= _loadTemplate($text);
        ($meta, $text) = Foswiki::Func::readTopic('System', 'VueJSTemplate');
        $return .= _loadTemplate($text);
    }

    return $return . $scripts;
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

1;
