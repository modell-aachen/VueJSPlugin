# ---+ Extensions
# ---++ FlatSkinPlugin

# ---+++++ DEVELOPMENT OPTIONS
# **BOOLEAN**
# Use source files instead of minified scripts and stylesheets.
# <br />
# <strong style="color:maroon;">Do NOT check this option unless you're using a development environment.</strong>
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{Debug} = 0;

# ---+++++ PACE
# **BOOLEAN**
# Disable the automatic page load progress bar.
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{DisablePACE} = 0;

# **STRING**
# URL to custom CSS theme.
# <br />
# <a href="http://github.hubspot.com/pace/docs/welcome/" target="_blank">sdf</a>
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{CustomPACE} = '';

# ---+++++ OFFLINE
# **BOOLEAN**
# Disable connectivity checks.
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{DisableOffline} = 0;

# **STRING**
# URL to custom CSS theme.
# <br />
# <a href="http://github.hubspot.com/offline/docs/welcome/" target="_blank">sdf</a>
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{CustomOffline} = '';
