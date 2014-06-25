# grunt-snapster

A grunt task to get automated snapshots of websites in several browsers
using browserstack.

## Getting Started
_If you haven't used [grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide._

From the same directory as your project's Gruntfile and package.json, install
this plugin with the following command:

```bash
npm install grunt-snapster --save-dev
```

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('grunt-snapster');
```

Inside your `grunt.js` file add a section named `snapster`. This section
specifies the tasks. Each task takes the following options.

## Options

### credentials

This is an `Object` with your browerstack credentials. The credentials are
important to connect to your browserstack account. It contains a
`username` and `key` property. Each value must be specified as `String`.

Be aware to **not store any secure data** in a file which will be published.
For this case you can store your data in an extra JSON file and link it through
the `file` property of the `credentials` object. This file should be ignored in
your VCS. The JSON should look like this:

```JSON
{
	"username": "your-username",
	"key": "your-access-key"
}
```

### tunnel

This option specifies your if a `tunnel` between browserstack and your system
should be opened to enable testing of your local servers. By default, this
option is set to `false`.

Keep in mind, when using the `host` property with values like `'localhost'`
you have to enable this option.

### host

This defines the `host` of the site where the snapshot should be taken from.
Default value is `'github.com'` ;-)

### port

This defines the `port` of the site where the snapshot should be taken from.
Dafault value is `80`.

### pathname

This is the `pathname` of the site where the snapshot sould be taken from.
Default value is `'/'`.

### ssl

Defines whether to use `ssl` or not. By default this value is set to `false`.

### browsers

This is an array of all browers which should be snapshooted through this task.
By default its an empty array (`[]`). Each item in this array represents a
specific browser/os/version configuration. To get a list of browser you can
click here to view the [BROWSERS.md](./BROWSERS.md).

If you want to snapshoot all currently available browsers through browserstack,
change the value of this property to `'all'`.

### delay

Defines the time to wait between the initial request and the final snapshot.
Default value is set to `2000`

### output

Defines the output directory were the snapshot will be saved. It supports the
[grunt template functions](http://gruntjs.com/api/grunt.template). The default
value is `'.grunt/snapster/<%= grunt.template.today("yyyy mmmm dS - h:MM:ss TT") %>/'`.

### filename

This is the schema of a filename for each snapshot. The files will be genrated
with this name inside the `output` folder. This option supports the
[grunt template functions](http://gruntjs.com/api/grunt.template). Each
property defined inside the `browser` object can be used in the filename. By
default the filenames will use this schema:
`'<%= browser %><%= version %>_<%= device %>_<%= os %>-<%= osVersion %>.png'`

## Example

```javascript
snapser: {
	credentials: {
		file: 'snapser.credentials'
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	ssl: false,
	pathname: '/index.html',
	browsers: [
		{
			browser: 'chrome',
			browser_version: '23.0',
			device: null,
			os: 'Windows',
			os_version: '8'
		},
		{
			browser: 'firefox',
			browser_version: '7.0',
			device: null,
			os: 'OS X',
			os_version: 'Mavericks'
		}
	]
}
```

## Browsers

You can find a [list of all browsers](./BROWSERS.md) here. To generate your own
list you can call `grunt snapster-browsers`. This will put a
[BROWSERS.md](./BROWSERS.md) inside `.grunt` directory in your project dir.

## License

[LICENSE (MIT)](https://github.com/schorfES/grunt-snapster/blob/master/LICENSE)
