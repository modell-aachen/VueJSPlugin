# ---+ Extensions
# ---++ FlatSkinPlugin

# **BOOLEAN**
# Use source files instead of minified scripts and stylesheets.
# <br />
# <strong style="color:maroon;">Do NOT check this option unless you're using a development environment.</strong>
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{Debug} = 0;

# **BOOLEAN**
# Enable to show edit buttons for attachments.
# Requires WebDAVContrib and FilesysVirtualPlugin
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{WebDAVIntegration} = 0;

# **STRING**
# Relative path to the WebDAV root of this wiki instance.
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{WebDAVLocation} = '/bin/dav';

# **PERL**
# Mapping of file extensions and their according MS Office application object class.
$Foswiki::cfg{Plugins}{FlatSkinPlugin}{WebDAVApps} = {
    'Access.Databases' => 'accdb|accdc|accde|accdr|accdt|accdu|accdw|accft|ade|adn|adp|mad|maf|mag|mam|maq|mar|mas|mat|mau|mav|maw|mdb|mde|mdn|mdt|mdw',
    'Word.Documents' => 'doc|docx|docm|dot|dotm|dotx|rtf',
    'PowerPoint.Presentations' => 'ppt|pptx|pptm|pot|potx|potm|pps|ppsx|ppsm|sldx|sldm|thm|thmx',
    'Excel.Workbooks' => 'xls|xlsx|xlsm|xlt|xltx|xltm|xlsb|csv|xld|xlm|xlshtml|xlw|xlxml|xlthtml',
    'Visio.Documents' => 'vdw|vdx|vsd|vsdm|vsdx|vss|vssm|vst|vstm|vstx|vsu|vsw|vsx|vtx',
    'Publisher.Documents' => 'pub',
    'Project.Ignored' => 'mpd|mpp|mpt|mpw|mpx'
};
