```python
print("Hello")
```

---
### Variables

```python
greeting = 'Hello again'
print(greeting)
```

```python
a = 'coucou'
b = 'world'
print(a, b)
---
coucou world
```

```python
add = 10 + 10
sub = 20 - 10
multi = 5 * 5
div = 10 / 5
print(add, sub, multi, div)
---
20 10 25 2
```

```python
happy = 2

if happy == 1:
    print("Happy and we know it!")
elif happy == 2:
    print("Excited about it!")
else:
    print("Not happy...")
```

---
### Boucle while

```python
counter = 0

while counter < 5:
    print(f'Hello #{counter}')
    counter = counter + 1
```

---
### List

```python
groceries = ['Walnuts', 'Grapes', 'Bird seeds']

# syntaxe alternative :

groceries = [
    'Walnuts',    # index 0
    'Grapes',     # index 1
    'Bird seeds'  # index 2
]
```

```python
var = "ABCDEF"
print(var[0], var[1], var[2], var[3], var[4], var[5])
---
A B C D E F


print(var[-1], var[-2], var[-3], var[-4], var[-5], var[-6])
---
F E D C B A
```

---
### Boucle for each

```python
groceries = ['Walnuts', 'Grapes', 'Bird seeds']

for food in groceries:
    print(f'I bought some {food} today.')

---
I bought some Walnuts today.
I bought some Grapes today.
I bought some Bird seeds today.
```

