define(function (require, exports, module) {
    "use strict";

    var unnamedPlaceholder = "→";

    function _getVisibilityClass(name, is_class) {
        if (is_class) return " outline-entry-class";
        if (name === unnamedPlaceholder) {
            return " outline-entry-unnamed";
        }
        return " outline-entry-" + (name[0] === "_" ? "private" : "public");
    }

    function _createListEntry(name, args, line, ch, is_class) {
        var $elements = [];
        var $name = $(document.createElement("span"));
        $name.addClass("outline-entry-name");
        $name.text(name);
        $elements.push($name);
        var $arguments = $(document.createElement("span"));
        $arguments.addClass("outline-entry-arg");
        $arguments.text(args);
        $elements.push($arguments);
        return {
            name: name,
            line: line,
            ch: ch,
            classes: "outline-entry-coffee outline-entry-icon" + _getVisibilityClass(name, is_class),
            $html: $elements
        };
    }

    /**
     * Create the entry list of functions language dependent.
     * @param   {Array}   text          Documents text with normalized line endings.
     * @param   {Boolean} showArguments args Preference.
     * @param   {Boolean} showUnnamed   unnamed Preference.
     * @returns {Array}   List of outline entries.
     */
    function getOutlineList(text, showArguments, showUnnamed) {
        var lines = text.split("\n");
        var regex = /(([\w\$]*)?\s*(?:=|:))?\s*(\([\w\$@,.'"= ]*\))?\s*(?:->|=>)/g;
        var regex2 = /class\s+(\w+)/g;
        var result = [];
        lines.forEach(function (line, index) {
            var match = regex.exec(line);
            while (match !== null) {
                var name = (match[2] || "").trim();
                var args = showArguments ? (match[3] || "()") : "";
                match = regex.exec(line);
                if (name.length === 0) {
                    if (showUnnamed) {
                        name = unnamedPlaceholder;
                    } else {
                        continue;
                    }
                }
                result.push(_createListEntry(name, args, index, line.length));
            }
            var match2 = regex2.exec(line);
            if (match2) {
                result.push(_createListEntry(match2[1], null, index, line.length, true));
            }
        });
        return result;
    }

    function compare(a, b) {
        if (b.name === unnamedPlaceholder) {
            return -1;
        }
        if (a.name === unnamedPlaceholder) {
            return 1;
        }
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    module.exports = {
        getOutlineList: getOutlineList,
        compare: compare
    };
});
