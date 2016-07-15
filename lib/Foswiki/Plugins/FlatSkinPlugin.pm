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

my %tabpanes;

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
      Foswiki::Func::writeWarning( 'Version mismatch between ',
          __PACKAGE__, ' and Plugins.pm' );
      return 0;
  }

  Foswiki::Func::registerTagHandler('FLATPANEL', \&_FLATPANEL);
  Foswiki::Func::registerTagHandler('FLATTABPANE', \&_FLATTABPANE);
  Foswiki::Func::registerTagHandler('FLATTAB', \&_FLATTAB);

  my $requestObject = Foswiki::Func::getRequestObject();
  my $useFlat = $requestObject->param('flat');
  if (defined $useFlat) {
    if($useFlat =~ /no|0/){
      Foswiki::Func::setPreferencesValue('SKIN', 'custom,risk,contextmenu,kvp,metacomment,modac');
    }
    if($useFlat =~ /yes|1/){
      Foswiki::Func::setPreferencesValue('SKIN', 'custom,risk,contextmenu,kvpflat,kvp,metacomment,flat,modac');
    }
  }

  return 1;
}

sub _FLATPANEL {
  my($session, $params, $topic, $web, $meta) = @_;

  my $title = $params->{_DEFAULT} || $params->{title} || '';
  return '' unless $title;

  my $tmpl = $params->{template} || '';
  my $content = $params->{content} || '';
  return '' unless $tmpl || $content;

  my $src = $params->{source} || '';
  if ($src) {
    my ($tweb, $ttopic) = Foswiki::Func::normalizeWebTopicName(undef, $src);
    Foswiki::Func::loadTemplate("$tweb.$ttopic");
  }

  $content = Foswiki::Func::decodeFormatTokens($content) if $content;
  $content = Foswiki::Func::expandTemplate($tmpl) if $tmpl;
  $content = $meta->expandMacros($content);
  $content = Foswiki::Func::renderText($content, $web, $topic);

  my $badge = $params->{badge} if defined $params->{badge};
  $badge = "<span class=\"badge\">$badge</span>" if $badge =~ /\d+/;
  $title = "<span class=\"title\">$title</span>";

  my $collapsible = $params->{collapsible} || '';
  $collapsible = "collapsible" if $collapsible;
  my $collapsed = $params->{collapsed} || '';
  $collapsed = "collapsed" if $collapsed && $collapsible;

  my $icon = $collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
  my $chevron = $collapsible ? "<i class=\"fa $icon\"></i>": '';

  return <<CONTENT;
<div class="ma-panel $collapsed">
  <div class="header $collapsible">$title $badge $chevron</div>
  <div class="content">$content</div>
</div>
CONTENT
}

sub _FLATTABPANE {
  my( $session, $params, $topic, $web, $topicObject ) = @_;

  my $id = $params->{id} || $params->{_DEFAULT} || '';
  return '' unless $id;

  return "<strong>%RED%A =FLATTABPANE= with ID =$id= is already defined within this topic!%ENDCOLOR%</strong>"
    if defined $tabpanes{$id} && $tabpanes{$id}->{hash};

  my $hash = Digest::SHA::sha1_hex($id);
  $hash = Digest::SHA::sha1_hex($hash . rand(99999));

  my $collapsible = $params->{collapsible} || 0;
  $collapsible = 1 if $collapsible;
  my $collapsed = $params->{collapsed} || 0;
  $collapsed = 1 if $collapsed && $collapsible;

  if (defined $tabpanes{$id}) {
    $tabpanes{$id}->{hash} = $hash;
    $tabpanes{$id}->{collapsible} = $collapsible;
    $tabpanes{$id}->{collapsed} = $collapsed;
  } else {
    $tabpanes{$id} = {
      collapsed => $collapsed,
      collapsible => $collapsible,
      hash => $hash,
      tabs => []
    }
  }

  return $tabpanes{$id}->{hash};
}

sub _FLATTAB {
  my( $session, $params, $topic, $web, $meta ) = @_;

  my $id = $params->{id} || '';
  return '' unless $id;

  my $badge = $params->{badge} if defined $params->{badge};
  my $title = $params->{_DEFAULT} || $params->{title} || '';
  return '' unless $title;

  my $tmpl = $params->{template} || '';
  my $content = $params->{content} || '';
  return '' unless $tmpl || $content;

  my $src = $params->{source} || '';
  if ($src) {
    my ($tweb, $ttopic) = Foswiki::Func::normalizeWebTopicName(undef, $src);
    Foswiki::Func::loadTemplate("$tweb.$ttopic");
  }

  $content = Foswiki::Func::decodeFormatTokens($content) if $content;
  $content = Foswiki::Func::expandTemplate($tmpl) if $tmpl;
  $content = $meta->expandMacros($content);
  $content = Foswiki::Func::renderText($content, $web, $topic);

  push @{$tabpanes{$id}->{tabs}}, {title => $title, badge => $badge, content => $content};
  return '';
}

sub completePageHandler {
  my( $html, $httpHeaders ) = @_;

  foreach my $id (keys %tabpanes) {
    my $pane = $tabpanes{$id};

    my @sorted = sort {$a->{title} cmp $b->{title}} @{$pane->{tabs}};
    my @lis = map {
      my $title = $_->{title};
      my $badge = $_->{badge} if defined $_->{badge};
      $badge = "<span class=\"badge\">$badge</span>" if $badge =~ /\d+/;
      $title = "<span class=\"title\">$title</span>";
      "<li><a href=\"#\">$title $badge</a></li>"
    } @sorted;

    my @divs = map {
      '<div>' . $_->{content} . '</div>'
    } @sorted;

    my $collapsible = $pane->{collapsible} ? 'collapsible' : '';
    my $collapsed = $pane->{collapsed} ? 'collapsed' : '';

    my $list = join('', @lis);
    my $content = join('', @divs);

    unless ($collapsed) {
      $list =~ s/^<li>/<li class="active">/;
      $content =~ s/^<div>/<div class="active">/;
    }

    my $icon = $collapsed ? 'fa-chevron-right' : 'fa-chevron-down';
    my $chevron = $collapsible ? "<span class=\"chevron\"><i class=\"fa $icon\"></i></span>": '';

    my $titles = "<ul class=\"header\">$list</ul>";
    my $contents = "<div class=\"content\">$content</div>";
    my $header = "<div class=\"header\">$chevron $titles</div>";
    my $text = "<div class=\"ma-tabpane $collapsible $collapsed\">$header$contents</div>";

    $_[0] =~ s/$pane->{hash}/$text/;
    delete $tabpanes{$id};
  }

  undef %tabpanes;
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
