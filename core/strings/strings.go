package vstrings

import (
	"strconv"
	"regexp"
	"strings"
)

var RECLAIMSTRING = regexp.MustCompile("^([\\s\\S]*?)(!STR!([0-9]+)!STR!)([\\s\\S]*)$") //Has s/e anchors
var ESCAPEDOLLARS = regexp.MustCompile("\\$")
var REPLACE020 = regexp.MustCompile("\020")

func HideStrings(input string) (string, []string) {
	sArr := make([]string, 0, 0)

	isString := false
	stringOpener := ""
	hasEscape := false
	hasInterp := false
	lastCh := ""
	strBuff := ""
	locBuff := ""
	for _, c := range input {
		char, _ := strconv.Unquote(strconv.QuoteRuneToASCII(c))
    if isString {
			//Switch when string opened
			switch (char) {
				case "{":
					if lastCh == "#" {
						hasInterp = true
					}
					strBuff += char
				case "}":
					hasInterp = false
					strBuff += char
				case "\\": //escape symbol, toggle escaping
					hasEscape = !hasEscape
					strBuff += char
				case "'", "\"": //close string
					if (!hasEscape) && (!hasInterp) && stringOpener == char{
						isString = false
						if hasEscape {hasEscape = false}
						locBuff += "!STR!" + strconv.Itoa(len(sArr)) + "!STR!"
						sArr = append(sArr, char+strBuff+char)
						strBuff = "" //reset string buffer
					} else {
						strBuff += char
					}

					if (hasEscape) {
						if hasEscape {hasEscape = false}
					}

				default:
					strBuff += char
					if hasEscape {hasEscape = false}
			}

		} else {
			//Switch when string closed
			switch (char) {
				case "'", "\"": //open string
					if !hasEscape {
						isString = true
						stringOpener = char
					}
				default: //add char to nonstring buffer
					locBuff += char
			}

		}

		//record last character (for interpolation check)
		lastCh = char
	}

	return locBuff, sArr
}

func ShowStrings(input string, sArr []string) (string, error) {
	local := input
	for {
		if RECLAIMSTRING.MatchString(local) == false {break}
		id, err := strconv.Atoi(RECLAIMSTRING.ReplaceAllString(local, "$3"))
		if err != nil {return "", err}
		if strings.Contains(sArr[id], "\n") {
			sArr[id] = "[[" + sArr[id][1:len(sArr[id])-1] + "]]"
		}
		get := "$1\020" + ESCAPEDOLLARS.ReplaceAllString(sArr[id],"$\020") + "$4"
		local = RECLAIMSTRING.ReplaceAllString(local, get) //the $1 doesnt like to be next to a string, so we put the space char code in
		local = REPLACE020.ReplaceAllString(local, "")
	}
	return local, nil
}
