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

    Foswiki::Func::registerTagHandler( 'VUE', sub {
            my ( $session, $params, $topic, $web, $topicObject ) = @_;
            my $app = $params->{_DEFAULT} || "Test";
            Foswiki::Func::addToZone( 'script', 'VUEJS', '<script type="text/javascript" src="%PUBURL%/System/VueJSPlugin/vue.js"></script>', "JQUERYPLUGIN");
            Foswiki::Func::addToZone( 'script', "VUEJS::$app", "<script type='text/javascript' src='%PUBURL%/System/VueJSPlugin/$app.js'></script>", "VUEJS");
            return "<div id='$app'> {{ message }} </div>";
    });

    return 1;
}

1;
