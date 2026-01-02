#### Sh

```sh
/bin/sh -i
```

#### perl

```perl
perl —e 'exec "/bin/sh";'
```

#### ruby

```ruby
ruby: exec "/bin/sh"
```

#### lua

```lua
lua: os.execute('/bin/sh')
```

#### awk

```bash
awk 'BEGIN {system("/bin/sh")}'
```

#### find

```bash
find / -name nameoffile -exec /bin/awk 'BEGIN {system("/bin/sh")}' \;
```

```bash
find . -exec /bin/sh \; -quit
```

#### vim

```bash
vim -c ':!/bin/sh'
```
