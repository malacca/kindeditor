import fs from 'fs';
import path from 'path';
import buble from 'rollup-plugin-buble';
import {terser} from 'rollup-plugin-terser';
import templateStringOptimize from 'rollup-plugin-template-string-optimize';


const outputDir = 'dist';

const LANG = 'zh-CN';
const SRC_FILES = [
	'src/core.js',
	'src/config.js',
	'src/event.js',
	'src/html.js',
	'src/selector.js',
	'src/node.js',
	'src/range.js',
	'src/cmd.js',
	'src/widget.js',
	'src/edit.js',
	'src/toolbar.js',
	'src/menu.js',
	'src/colorpicker.js',
	'src/uploadbutton.js',
	'src/dialog.js',
	'src/tabs.js',
	'src/ajax.js',
	'src/main.js',
];
const PLUGINS = [
	'anchor',
	'baidumap',
	'clearhtml',
	'code',
	'emoticons',
	'filemanager',
	'insertfile',
	'lineheight',
	'link',
	'pagebreak',
	'plainpaste',
	'preview',
	'quickformat',
	'table',
	'template',
	'wordpaste',
	//'imgresize',
	// 'map',
	//'multiimage',
];

// Rollup 配置自动生成
function mergerFiles(files, dst) {
    let code = '';
    files.forEach(file => {
        code += '// ' + file + "\n";
        code += fs.readFileSync(file, {encoding: "utf-8"});
        code += "\n".repeat(10);
	});
	//version
	const pkg = require('./package.json');
	code = code.replace(/\$\{VERSION\}/g, '4.1.12('+pkg.version+')');
    fs.writeFileSync(dst, code);
}
function banner(){
	return fs.readFileSync('src/header.js', {encoding: "utf-8"});
}
function footer(){
	return fs.readFileSync('src/footer.js', {encoding: "utf-8"});
}

function removeDir(src) {
	if (!fs.existsSync(src)) {
		return;
	}
	fs.readdirSync(src).forEach(file => {
		const curPath = path.join(src, file);
		if (fs.statSync(curPath).isDirectory()) {
			removeDir(curPath);
		} else {
			fs.unlinkSync(curPath);
		}
	});
	fs.rmdirSync(src);
}

function copyMiniCss(from, to) {
	if (!from.endsWith('.css')) {
		fs.copyFileSync(from, to);
		return;
	}
	let css = fs.readFileSync(from, {encoding: "utf-8"});
	css = css.replace(/\/\*([\s\S]*?)\*\//g, '');
	css = css.replace(/[\r\n\t]/g, '');
	css = css.replace(/:\s+/g, ':');
	css = css.replace(/;\s+/g, ';');
	css = css.replace(/\s?{\s?/g, '{');
	css = css.replace(/\s?,\s?/g, ',');
	css = css.replace(/;}/g, '}');
	fs.writeFileSync(to, css);
}

function copyDir(src, dst, css) {
	src = path.resolve(src);
	dst = path.resolve(dst);
	fs.mkdirSync(dst);
	fs.readdirSync(src).forEach(file => {
		const from = path.resolve(src + '/' + file), 
			to = path.resolve(dst + '/' + file);
		if (fs.statSync(from).isDirectory()) {
			copyDir(from, to, css);
		} else if (css) {
			copyMiniCss(from, to);
		} else {
			fs.copyFileSync(from, to);
		}
	})
}

// copy file
const config = [];
const dist = './' + outputDir;
const distLang = dist + '/lang';
const distPlugins = dist + '/plugins';
removeDir(dist)
fs.mkdirSync(dist);
copyDir('./lang', distLang);
copyDir('./plugins', distPlugins);
copyDir('./themes', dist + '/themes', true);

const R = {
	optimize: templateStringOptimize(),
	buble: buble({
		objectAssign: 'Object.assign',
	}),
	terser: terser(),
}

// lang
fs.readdirSync(distLang).forEach(file => {
	file = distLang + '/' + file;
	config.push({
		plugins: [R.optimize, R.buble, R.terser],
		input: file,
		output: {
			file,
			strict: false,
			compact: true
		}
	})
});

// plugins
fs.readdirSync(distPlugins).forEach(plugin => {
	const file = distPlugins + '/' + plugin + '/' + plugin + '.js';
	config.push({
		plugins: [R.optimize, R.buble, R.terser],
		input: file,
		output: {
			file,
			strict: false,
			compact: true
		}
	})
});

const output = {
    strict: false,
    compact: true,
	banner,
	footer,
    format: 'cjs',
};

// kindeditor.js
const coreFile = dist + '/kindeditor.js';
const coreMiniFile = dist + '/kindeditor.min.js';
mergerFiles(SRC_FILES, coreFile);
config.push({
	plugins: [R.optimize, R.buble],
	input: coreFile,
    output: [
        {...output, file: coreFile},
        {...output, file: coreMiniFile, plugins: [R.terser]},
    ],
});

// kindeditor.all.js
const defaultPlugins = [];
PLUGINS.forEach(p => {
	defaultPlugins.push('plugins/' + p + '/' + p + '.js')
});
const allFile = dist + '/kindeditor.all.js';
const allMiniFile = dist + '/kindeditor.all.min.js';
mergerFiles(SRC_FILES.concat('lang/' + LANG + '.js').concat(defaultPlugins), allFile);
config.push({
	plugins: [R.optimize, R.buble],
	input: allFile,
    output: [
        {...output, file: allFile},
        {...output, file: allMiniFile, plugins: [R.terser]},
    ]
});

export default config;