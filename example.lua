function test()
  print "hello"
end

function add(a, b)
  return a+b
end

for i = 1, 100  do

end

for i,_ in ipairs({1, 2, 3}) do
  print i
end

for cat,_ in pairs(cats) do
  print cat.meow()
end

while (a ~= 1) do
  a = a -  1
end

while (true) do

end

if (a == 1) then
  print ("a is 1")
else
  print ("a isnt 1")
end

if (a == 1) then
  print ("a is 1")
elseif (b == 2) then
  print ("b is 2")
end

test = {}
test[#test+1] = "Hello!"
test[#test+1] = "Hello Again!"

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
string, it has a newline in it]]
