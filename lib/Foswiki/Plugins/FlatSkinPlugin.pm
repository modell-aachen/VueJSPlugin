package Foswiki::Plugins::FlatSkinPlugin;

use strict;
use warnings;

use Foswiki::Func ();
use Foswiki::Plugins ();
use Foswiki::Plugins::JQueryPlugin ();

use JSON;

use version;
our $VERSION = version->declare( '1.0.0' );
our $RELEASE = '1.0.0';

our $NO_PREFS_IN_TOPIC = 1;
our $SHORTDESCRIPTION = 'Q.Wiki Skin';
my $plugin = 'FlatSkinPlugin';
my $VERSIONQUERY = "?version=$RELEASE";

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  # stop processing if VarSKIN is not set to 'flat'
  my $session = $Foswiki::Plugins::SESSION;
  my $params = $session->{request}->{param};
  if ( $params && $params->{skin} ) {
    my $skins = $params->{skin};
    return 1 unless grep( /flat/, @$skins ) || join('', @$skins) eq '';
  } else {
    my $skin = Foswiki::Func::getPreferencesValue( 'SKIN' );
    return 1 if ( $skin && $skin !~ m/flat/i );
  }

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
    Foswiki::Func::writeWarning( 'Version mismatch between ', 
      __PACKAGE__, ' and Plugins.pm' );
    return 0;
  }

  Foswiki::Meta::registerMETA(
    'FLATCOMMENT',
    many => 1,
    require => ['author', 'date', 'pid', 'text', 'type']
  );

  Foswiki::Func::registerTagHandler( 'DEFAULTDATEFORMAT', \&_handleDATEFORMAT );

  # TBD. werden die beiden MA... macros überhaupt noch gebraucht?
  Foswiki::Func::registerTagHandler( 'QWWEBLIST', \&_handleWEBLIST );
  Foswiki::Func::registerTagHandler( 'FLATCOMMENTSLIST', \&_handleFLATCOMMENTS );

  Foswiki::Func::registerRESTHandler( 'rendermulti', \&_handleRenderMulti,
    authenticate => 0,
    validate => 0,
    http_allow => 'GET,POST',
  );

  Foswiki::Func::registerRESTHandler( 'comment', \&_handleComment,
    authenticate => 1,
    http_allow => 'POST,PUT',
    validate => 0
  );

  Foswiki::Func::registerRESTHandler( 'validation', \&_handleValidation,
    authenticate => 1,
    http_allow => 'GET',
    validate => 0
  );

  # inject scripts and styles
  _zoneConfig();
  return 1;
}

my @entries = ();
sub addToLeftbar {
  my %entry = @_;

  return unless $entry{container};
  return unless $entry{title};
  return unless $entry{content};
  push( @entries, \%entry );
}

sub completePageHandler {
  my( $html, $httpHeaders ) = @_;

  return unless scalar @entries;
  my @scripts = ();

  for (@entries) {
    my $json = encode_json( $_ );
    push ( @scripts, "QWiki.plugins.sidebar.registerLeftBarEntry( $json );" );
  }

  my $script = join("\n", @scripts);
  if ( Foswiki::Func::getContext()->{SafeWikiSignable} ) {
    Foswiki::Plugins::SafeWikiPlugin::Signatures::permitInlineCode( $script );
  }

  $_[0] =~ s/<!-- sidebar:left -->/<script>$script<\/script>/;
}

sub _suffix {
  my $dev = $Foswiki::cfg{Plugins}{$plugin}{Debug} || 0;
  return ($dev ? '' : '.min');
}

sub _zoneConfig {
  my $suffix = _suffix;
  my $path = "%PUBURLPATH%/%SYSTEMWEB%/$plugin";

  my $styles = <<"STYLES";
<link rel="stylesheet" href="$path/css/qwiki$suffix.css$VERSIONQUERY" />
STYLES

  my $scripts = <<"SCRIPTS";
<script src="$path/js/qwiki$suffix.js$VERSIONQUERY"></script>
SCRIPTS

  $scripts .= <<"EDITSCRIPTS" if Foswiki::Func::getContext()->{edit};
<script src="$path/js/qwiki-edit$suffix.js$VERSIONQUERY"></script>
EDITSCRIPTS

  Foswiki::Func::addToZone( 'head', 'FLATSKIN::STYLES', $styles );
  Foswiki::Func::addToZone( 'script', 'FLATSKIN::SCRIPTS', $scripts, 'JQUERYPLUGIN::FOSWIKI' );
}

sub _handleDATEFORMAT {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my $default = $Foswiki::cfg{DefaultDateFormat} || '$day $month $year';
  $default =~ s/\$day/DD/;
  $default =~ s/\$month/MMM/;
  $default =~ s/\$mon/MM/;
  $default =~ s/\$year/YYYY/;

  return $default . ' - HH:mm';
}

sub _handleWEBLIST {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my @webs = split( '/', $web );
  my @retval = ();
  my $format = $params->{format} || '<li class="qw-breadcrumb-web"><a href="$link">$title</a></li>';
  foreach (@webs) {
    my $parent = $_;
    my $pos = index( $web, "/$_" );
    if ( $pos ne -1 ) {
      $parent = substr( $web, 0, $pos ) . "/$_";
    }

    my $entry = $format;
    $entry =~ s#\$link#%SCRIPTURLPATH{view}%/$parent/%HOMETOPIC%#g;
    $entry =~ s#\$title#%MAKETEXT{"[_1]" args="<nop>$_"}%#g;
    push( @retval, $entry );
  }

  return join( '', @retval );
}

sub _handleFLATCOMMENTS {
  my( $session, $params, $topic, $web, $topicObject ) = @_;
  my ($w, $t) = Foswiki::Func::normalizeWebTopicName($web, $topic);
  my ($meta) = Foswiki::Func::readTopic($w, $t);

  my @cmts = $meta->find('FLATCOMMENT');
  my $json = encode_json( \@cmts );
  return $json;
}

sub _handleRenderMulti {
  my $session = shift;
  my $q = $session->{request};
  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName(undef, $q->param('topic'));
  my $meta = Foswiki::Meta->new($session, $web, $topic);

  my $json = decode_json($q->param('request'));
  my $res;
  while (my ($k, $v) = each(%$json)) {
    $res->{$k} = Foswiki::Func::expandCommonVariables($v, $topic, $web, $meta);
  }
  $res = encode_json($res);
  $session->{response}->header(
      -type    => 'text/plain',
      -charset => 'UTF-8'
  );
  $session->{response}->print($res);
  return undef;
}

sub _handleValidation {
  my ( $session, $subject, $verb, $response ) = @_;

  my $q = $session->{request};
  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName(undef, $q->param('topic'));
  my $cgis = $session->getCGISession();

  require Foswiki::Validation;
  my $key = Foswiki::Validation::generateValidationKey( $cgis, "$web.$topic" );
  return $key;
}

sub _handleComment {
  my ($session, $subject, $verb, $response) = @_;
  my $q = $session->{request};
  my ($web, $topic) = Foswiki::Func::normalizeWebTopicName(undef, $q->param('topic'));
  my ($meta, $text) = Foswiki::Func::readTopic($web, $topic);

  my $changed = 0;
  my $method = $q->{method};
  if ($method =~ m/^post$/i) {
    my $cmt = decode_json($q->param('comment'));
    $cmt->{author} = Foswiki::Func::getWikiName($session->{user});
    $cmt->{date} = time;
    $cmt->{name} = _uniqueID();

     my $hasType = $cmt->{type} =~ m/^[012]$/;
     my $hasPID=  $cmt->{pid} =~ m/^[\w\d]+$/;
     my $hasText = $cmt->{text};
     if ( $hasText ) {
      $hasText =~ s/\s+$//;
      $hasText =~ s/^\s+//;
     }

     if ( $hasType && $hasPID && $hasText ) {
      $meta->putKeyed('FLATCOMMENT', $cmt);
      $changed = 1;
      $response->{status} = 204;
     } else {
      $response->{status} = 400;
     }
  } elsif ($method =~ m/^put$/i) {
    # update existing comment
    my $cmt = decode_json($q->param('comment'));
    $cmt->{author} = Foswiki::Func::getWikiName($session->{user});
    $cmt->{date} = time;
    $meta->putKeyed('FLATCOMMENT', $cmt);
    $changed = 1;
    $response->{status} = 204;
  } else {
    $response->{status} = 405;
  }

  my %opts = (dontlog => 1, minor => 1);
  $meta->saveAs($web, $topic, %opts) if $changed;
}

sub _uniqueID {
  my $rng = sprintf ("%x", time);;
  for (my $i = 0; $i < 5; $i++) {
    $rng .= sprintf("%x", int(rand(1) * 65535))
  }

  return $rng;
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Modell Aachen GmbH (http://www.modell-aachen.de)

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
