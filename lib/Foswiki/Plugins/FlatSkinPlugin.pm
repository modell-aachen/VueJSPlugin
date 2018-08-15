package Foswiki::Plugins::FlatSkinPlugin;

use strict;
use warnings;

use Foswiki::Func;
use Foswiki::Plugins;

use Digest::SHA;
use version;

our $VERSION = version->declare( '1.0.0' );
our $RELEASE = '1.0.0';
our $NO_PREFS_IN_TOPIC = 1;
our $SHORTDESCRIPTION = "Modell Aachen's default skin for Q.wiki";

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
      Foswiki::Func::writeWarning( 'Version mismatch between ',
          __PACKAGE__, ' and Plugins.pm' );
      return 0;
  }


  Foswiki::Func::addToZone( 'head', 'FLATSKIN_WRAPPED',
      '<link rel="stylesheet" type="text/css" media="all" href="%PUBURLPATH%/%SYSTEMWEB%/FlatSkin/css/flatskin_wrapped.min.css?version=%QUERYVERSION{"FlatSkinPlugin"}%" />');

  Foswiki::Func::registerTagHandler('GETVIRTUALWEB', \&_GETVIRTUALWEB);

  return 1;
}

sub maintenanceHandler {
  Foswiki::Plugins::MaintenancePlugin::registerCheck("FlatSkinPlugin:check_enabled", {
      name => "FlatSkinPlugin: Should be enabled",
      description => "The FlatSkinPlugin should be enabled",
      check => sub {
          my $result = { result => 0 };
          unless ($Foswiki::cfg{Plugins}{FlatSkinPlugin}{Enabled} eq 1) {
              $result->{result} = 1;
              $result->{priority} = $Foswiki::Plugins::MaintenancePlugin::WARN;
              $result->{solution} = "Please enable the FlatSkinPlugin.";
          }

          return $result;
     }
  });
}

sub _GETVIRTUALWEB {
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

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: %$AUTHOR%

Copyright (C) 2016 Modell Aachen GmbH

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
more details.

You should have received a copy of the GNU General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
