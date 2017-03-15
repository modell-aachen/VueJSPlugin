package Foswiki::Plugins::VueJSPlugin;

use strict;
use warnings;

=begin TML
---+ package Foswiki::Plugins::VueJSPlugin
Container for Vue.JS
=cut


use Foswiki::Func ();
use Foswiki::Plugins ();

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

  return 1;
}

###############################################################################

sub loadDependencies {

    my ( $session, $params, $topic, $web, $topicObject ) = @_;
    my $pluginURL = '%PUBURL%/%SYSTEMWEB%/VueJSPlugin';
    my $dev = $Foswiki::cfg{Plugins}{VueJSPlugin}{UseSource} || 0;
    my $suffix = $dev ? '' : '.min';

    my $app = $params->{_DEFAULT} || "App";
    Foswiki::Func::addToZone( 'script', 'VUEJSPLUGIN', "<script type='text/javascript' src='$pluginURL/vue$suffix.js'></script>");
    Foswiki::Func::addToZone( 'head', "VUEJS::STYLES", "<link rel='stylesheet' type='text/css' href='$pluginURL/vue$suffix.css' />");

    my $scripts = <<LOAD;
<script type='text/javascript' src='$pluginURL/$app$suffix.js'></script>
<link rel='stylesheet' type='text/css' href='$pluginURL/$app$suffix.css' />
LOAD

    my $return;
    my ($meta, $text) = Foswiki::Func::readTopic('System', $app .'VueTemplate');
    $return .= _loadTemplate($text);
    ($meta, $text) = Foswiki::Func::readTopic('System', 'VueJSTemplate');
    $return .= _loadTemplate($text);

    return $return . $scripts;
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
