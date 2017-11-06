#!/usr/bin/perl -w
use strict;
use warnings;

BEGIN { unshift @INC, split( /:/, $ENV{FOSWIKI_LIBS} ); }
use Foswiki::Contrib::Build;

package VueJSPluginBuild;
our @ISA = qw(Foswiki::Contrib::Build);

sub new {
my $class = shift;
return bless($class->SUPER::new( "VueJSPlugin" ), $class);
}

sub target_release {
my $this = shift;

print <<GUNK;

Building release $this->{RELEASE} of $this->{project}, from version $this->{VERSION}
GUNK
if ( $this->{-v} ) {
print 'Package name will be ', $this->{project}, "\n";
print 'Topic name will be ', $this->getTopicName(), "\n";
}

$this->_installDeps();

$this->build('compress');
$this->build('build');
$this->build('installer');
$this->build('stage');
$this->build('archive');
}

sub _installDeps {
my $this = shift;

local $| = 1;
print $this->sys_action( qw(npm install) );
}

my $build = VueJSPluginBuild->new();
$build->build( $build->{target} );

