package venus

import (
  "regexp"
  "./strings"
)

type Matcher struct {
  match string
  replace string
}

func NewMatcher(match string, replace string) *Matcher {
  m := new(Matcher)
  m.match = match
  m.replace = replace
  return m
}

func (m Matcher) Replace(input string) string {
  r:= regexp.MustCompile(m.match)
  return r.ReplaceAllString(input, m.replace)
}

const VARIABLENAME = "[a-zA-Z_]+(?:[a-zA-Z0-9_]*)"
const TYPEKEY = "(num|str|bool|table|tbl)"


var matchers []Matcher
func InitMatchers() {
  //Comments
  matchers = append(matchers, *NewMatcher("---([\\s\\S]*)---", "--[[ $1 --]]"))
  //Typed Variables (remove type)
  matchers = append(matchers, *NewMatcher(TYPEKEY"\\s*("+VARIABLENAME+")", "$2"))
}

var postMatchers []Matcher
func InitPostMatchers() {
  //strings with newlines in them
  //postMatchers = append(postMatchers, *NewMatcher("(\"|')((?:\\\\1|(?:(?!\\1).|\\n))*)\\1", "[[$1]]"))
}



func DoMatchers(input string, matches []Matcher) string {
  for _, matcher := range matches {
    input = matcher.Replace(input)
  }
  return input
}

func Translate(input string) (string, error) {

  //Hide Strings (also turns multis into [[]])
  input, strs := vstrings.HideStrings(input)

  //Replace Stuff
  InitMatchers()
  input = DoMatchers(input, matchers)

  //Get strings back
  input, err := vstrings.ShowStrings(input, strs)
  if err != nil {return "", err}

  //Replace Stuff After we get strings back
  InitPostMatchers()
  input = DoMatchers(input, postMatchers)

  //Return
  return input, nil
}
