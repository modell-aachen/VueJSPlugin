package Foswiki::Plugins::FlatSkinPlugin;

use strict;
use warnings;

use Foswiki::Func ();
use Foswiki::Plugins ();

use version;
our $VERSION = version->declare( '1.0.0' );
our $RELEASE = '1.0';
our $NO_PREFS_IN_TOPIC = 1;
our $SHORTDESCRIPTION = 'ModacSkin 2.0';

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
      Foswiki::Func::writeWarning( 'Version mismatch between ',
          __PACKAGE__, ' and Plugins.pm' );
      return 0;
  }

  Foswiki::Func::registerTagHandler( 'MA_WEBLIST', \&handleWebList );

  return 1;
}

sub handleWebList {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my @webs = split( '/', $web );
  my @retval = ();
  foreach (@webs) {
    my $parent = $_;
    my $pos = index( $web, "/$_" );
    if ( $pos ne -1 ) {
      $parent = substr( $web, 0, $pos ) . "/$_";
    }

    my $entry = "<li><a href=\"%SCRIPTURLPATH{\"view\"}%/$parent/%HOMETOPIC%\">%MAKETEXT{\"[_1]\" args=\"<nop>$_\"}%</a></li>";
    push( @retval, $entry );
  }

  return join( '', @retval );
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Modell Aachen GmbH <http://www.modell-aachen.de>

Copyright (C) 2008-2013 Foswiki Contributors. Foswiki Contributors
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
