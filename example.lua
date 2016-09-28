fn test() {
  print "hello"
}

fn add(a, b) num {
  return a+b
}

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
ing, its bted]]
 --]]
