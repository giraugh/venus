fn test() {
  print "hello"
}

fn add(num a, num b) num {
  return a+b
}

num a = 100
num b = +100
num c = -100
num d = .3
num e = 0.3
num f = 2.3e1
num g = 5e+20
num h = 2.1e-39

str a = "this is a dq string"
str b = "this is a string\nwith a return"
str c = 'this is a sq string\n'
str d = "This is also a
string, its bted"



--[[ 
what that compiles to
function test()
  print("hello")
end

function add(a, b)
  return a+b
end

a = 100
b = +100
c = -100
d = .3
e = 0.3
f = 2.3e1
g = 5e+20
h = 2.1e-39

a = "this is a dq string"
b = "this is a string\nwith a return"
c = 'this is a sq string\n'
d = [[This is also a
string, its bted]]
 --]]
