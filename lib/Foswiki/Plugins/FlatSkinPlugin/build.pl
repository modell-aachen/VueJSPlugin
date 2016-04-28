#!/usr/bin/perl -w
use strict;
BEGIN { unshift @INC, split(/:/, $ENV{FOSWIKI_LIBS}); }
use Foswiki::Contrib::Build;

package FlatSkinBuild;
our @ISA = qw(Foswiki::Contrib::Build);

sub new {
  my $class = shift;
  return bless($class->SUPER::new( "FlatSkinPlugin" ), $class);
}

sub target_build {
  my $this = shift;
  $this->_installDeps();
}

sub target_compress {}

sub _installDeps {
  my $this = shift;

  local $| = 1;
  print $this->sys_action( qw(npm install) );
}

my $build = FlatSkinBuild->new();
$build->build($build->{target});
