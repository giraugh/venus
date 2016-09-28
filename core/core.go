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

var matchers []Matcher
func InitMatchers() {
  //Comments
  matchers = append(matchers, *NewMatcher("---([\\s\\S]*)---", "--[[ $1 --]]"))
}

func DoMatchers(input string, matches []Matcher) string {
  for _, matcher := range matches {
    input = matcher.Replace(input)
  }
  return input
}

func Translate(input string) (string, error) {

  //Hide Strings
  input, strs := strings.HideStrings(input)

  //Replace Stuff
  InitMatchers()
  input = DoMatchers(input, matchers)

  //Get strings back
  input, err := strings.ShowStrings(input, strs)
  if err != nil {return "", err}

  //Return
  return input, nil
}
