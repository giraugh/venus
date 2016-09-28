package main

import (
	"./core"
	"fmt"
	"flag"
	"os"
	"path/filepath"
	"regexp"
	"io/ioutil"
)

var target string
var muted bool
var verbose bool
var extension string
var outextension string
func main() {
	flag.BoolVar(&muted, "muted", false, "Dont output to stdout")
	flag.BoolVar(&verbose, "verbose", false, "Dont output extra info")
	flag.StringVar(&extension, "extension", ".vns", "Extension to look for")
	flag.StringVar(&outextension, "out", ".lua", "Extension to replace with")
	flag.Parse()

	//get args
	if flag.NArg() >= 1 {
		target = flag.Arg(0)
	} else {
		target = "."
	}

	//is target a directory?
	isdir, _ := IsDirectory(target);
	if isdir {
		log(target+" is a directory")
		filepath.Walk(target, visit)
		return
	}

	//is target.shine a file?
	if _, err := os.Stat(target+extension); err == nil {
  	log(target+extension+" is a file");
		compile(target+extension)
		return
	}

	//is target a file?
	if _, err := os.Stat(target); err == nil {
  	log(target+" is a file");
		compile(target)
		return
	}

}

func compile(path string) {
	say("COMPILING "+path)

	//read files bytes into bs
	bs, _ := ioutil.ReadFile(path)

	//conver to string
	contents := string(bs)

	//translate
	translated, _ := venus.Translate(contents)

	//change the file extension
	var exten = regexp.MustCompile("(\\.\\w+$)")
	path = exten.ReplaceAllString(path, outextension)

	//write new file
	ioutil.WriteFile(path, []byte(translated), 0644)

	say(" (DONE)\n")
}

//for directory walking
func visit(path string, f os.FileInfo, err error) error {

	//check files extension
	var exten = regexp.MustCompile("[\\s\\S]*(\\.\\w+$)")
	if exten.ReplaceAllString(path,"$1") == extension {
		compile(path)
	}

	return nil
}


//helpers
func log(input string) {
	if !muted && verbose {
		fmt.Println(input)
	}
}

func say(input string) {
	if !muted {
		fmt.Print(input)
	}
}


func IsDirectory(path string) (bool, error) {
    fileInfo, err := os.Stat(path)
		if err != nil {
			return false, err
		}
    return fileInfo.IsDir(), nil
}
