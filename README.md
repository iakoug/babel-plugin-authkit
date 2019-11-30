# babel-plugin-authkit
A plugin that make `import` on demand.

See also [`babel-plugin-lodash`](https://github.com/megawac/babel-plugin-lodash).

#### Example

Converts

```js
import { a, b } from 'authkit';

a(b);
```

Converts above to:

```js
import _a from 'authkit/src/a';
import _b from 'authkit/src/b';

_a(_b);
```

#### Usage

###### Via `.babelrc`

```json
{
  "plugins": ["authkit"]
}
```
