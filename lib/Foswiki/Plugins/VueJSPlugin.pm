package Foswiki::Plugins::VueJSPlugin;

use strict;
use warnings;

=begin TML
---+ package Foswiki::Plugins::VueJSPlugin
Container for Vue.JS
=cut


use Foswiki::Func ();
use Foswiki::Meta ();
use Foswiki::Plugins ();
use Foswiki::Plugins::JQueryPlugin();
use Foswiki::Contrib::JsonRpcContrib ();

our $VERSION = '0.00_001';
our $RELEASE = '08 Mar 2016';
our $SHORTDESCRIPTION = '';
our $NO_PREFS_IN_TOPIC = 1;
our $service;

sub initPlugin {
    my ($topic, $web) = @_;
    unless ( $Foswiki::cfg{Plugins}{JQueryPlugin}{Enabled} ) {
        Foswiki::Func::writeWarning(
            "VueJSPlugin is enabled but JQueryPlugin is not. Both must be installed and enabled for VUE."
        );
        return 0;
    }

    my $pluginURL = '%PUBURL%/%SYSTEMWEB%/VueJSPlugin';
    my $dev = $Foswiki::cfg{Plugins}{VueJSPlugin}{UseSource} || 0;
    my $suffix = $dev ? '' : '.min';
    Foswiki::Func::registerTagHandler( 'VUE', sub {
            my ( $session, $params, $topic, $web, $topicObject ) = @_;
            my $app = $params->{_DEFAULT} || "App";
            Foswiki::Func::addToZone( 'script', 'VUEJSPLUGIN', "<script type='text/javascript' src='$pluginURL/vue$suffix.js'></script>", "JQUERYPLUGIN");
            Foswiki::Func::addToZone( 'head', "VUEJS::STYLES", "<link rel='stylesheet' type='text/css' href='$pluginURL/vue.css'></link>");
            Foswiki::Func::addToZone( 'script', "VUEJSPLUGIN::$app", "<script type='text/javascript' src='$pluginURL/$app.js'></script>", "VUEJSPLUGIN");
            return "<div id='$app' v-cloak> {{ message }}</div>";
    });

    return 1;
}

1;
