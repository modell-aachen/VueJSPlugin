package Foswiki::Plugins::FlatSkinPlugin;

use strict;
use warnings;

use Foswiki::Func ();
use Foswiki::Plugins ();
use Foswiki::Plugins::JQueryPlugin ();

use version;
our $VERSION = version->declare( '2.0.0' );
our $RELEASE = '2.0.0';

our $NO_PREFS_IN_TOPIC = 1;
our $SHORTDESCRIPTION = 'Q.Wiki Skin';
my $plugin = 'FlatSkinPlugin';

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  # stop processing if VarSKIN is not set to 'flat'
  my $session = $Foswiki::Plugins::SESSION;
  my $params = $session->{request}->{param};
  if ( $params && $params->{skin} ) {
    my $skins = $params->{skin};
    return 1 unless grep( /flat/, @$skins );
  } else {
    my $skin = Foswiki::Func::getPreferencesValue( 'SKIN' );
    return 1 if ( $skin && $skin !~ m/flat/i );
  }

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
      Foswiki::Func::writeWarning( 'Version mismatch between ',
          __PACKAGE__, ' and Plugins.pm' );
      return 0;
  }

  Foswiki::Func::registerTagHandler( 'MA_PACE', \&_handlePACE );

  # inject scripts and styles
  _zoneConfig();

  return 1;
}

sub _suffix {
  my $dev = $Foswiki::cfg{Plugins}{$plugin}{Debug} || 0;
  return ($dev ? '' : '.min');
}

sub _zoneConfig {
  my $styles = '';
  my $scripts = '';
  my $suffix = _suffix;
  my $path = "%PUBURLPATH%/%SYSTEMWEB%/$plugin";

  if ( $suffix ) {
    $styles = <<"STYLES";
<link rel="stylesheet" href="$path/css/app$suffix.css" />
STYLES

    $scripts = <<"SCRIPTS";
<script src="$path/js/app$suffix.js"></script>
SCRIPTS
  } else {
    $styles = <<"STYLES";
<link rel="stylesheet" href="$path/css/app.css" />
STYLES

    $scripts = <<"SCRIPTS";
<script src="$path/js/underscore.js"></script>
<script src="$path/js/modernizr.js"></script>
<script src="$path/js/fastclick.js"></script>
<script src="$path/js/foundation.js"></script>
<script src="$path/js/app.js"></script>
SCRIPTS
  }

  Foswiki::Func::addToZone( 'head', 'FLATSKIN::STYLES', $styles );
  Foswiki::Func::addToZone( 'script', 'FLATSKIN::SCRIPTS', $scripts, 'JQUERYPLUGIN::FOSWIKI' );

  # register jquery dependencies
  # my @jqdeps = ( 'blockui', 'cookie', 'jsonrpc', 'placeholder' );
  # foreach (@jqdeps) {
  #   Foswiki::Plugins::JQueryPlugin::createPlugin( $_ );
  # }
}

sub _handlePACE {
  my( $session, $params, $topic, $web, $topicObject ) = @_;
  my $min = _suffix;
  my $path = "%PUBURLPATH%/%SYSTEMWEB%/$plugin";
  my $pace = <<"PACE";
<link rel="stylesheet" href="$path/css/pace$min.css" />
<script src="$path/js/pace$min.js"></script>
PACE
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Sven Meyer <meyer@modell-aachen.de>

Copyright (C) 2008-2014 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.
