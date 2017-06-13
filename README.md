
### install npm by nvm(if you don't have node installed)

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash`

add below to .bash_profile or .zshrc

```bash
# if you use bash replace shellProfile with .bash_profile
shellProfile='.zshrc'
echo 'export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm' >> $shellProfile
source $shellProfile
nvm install 7.7.2
```

### check your node and npm is already installed and install yarn

```bash
node -v
# v7.7.2
npm -v
# 4.1.2
npm install -g yarn

yarn -v
# yarn install v0.24.5
```

### pull the init environment

```bash
git clone https://github.com/boydfd/jest.git
# if you have yarn
yarn
```

### install all dependences add jest to project 

`yarn && yarn add --dev jest babel-jest react-test-renderer`

### add first test

1. add jest configuration in package.json

```
// package.json

"jest": {
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.js?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).js?(x)"
    ]
  },
```

2. add test file

```javascript
// src/helloWorld.spec.js

it('first test', () => {
  expect(true, true)
})
```

3. run `yarn jest`

### add second test with es6 syntax

1. add one more test in helloWorld.spec.js

```
// src/helloWorld.spec.js

import { arrowFunction } from './es6'

it('first test', () => {
  expect(true, true)
})

it('second test with es6 syntax', () => {
  expect('arrowFunction', arrowFunction())
})
```

2. add es6.js file

```
// src/es6.js

export const arrowFunction = () => {
  return 'arrowFunction'
}
```

3. run test and we will see error below:

```
({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import { arrowFunction } from './es6';
                                                                                             ^^^^^^
    SyntaxError: Unexpected token import

```

### add es6 syntax support

1. add babel es2015 (this package makes es6 syntax available)

`yarn add --dev babel-preset-es2015`

2. add es2015 configuration in package.json

```
// package.json

"babel": {
    "presets": [
      "es2015",
      "react"
    ]
  },
```

3. run test again and we can get test passed:

```
PASS src/helloWorld.spec.js
  ✓ first test (3ms)
  ✓ second test with es6 syntax (1ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.656s
Ran all test suites.
✨  Done in 2.88s.
```

### add shared path alias (option)
1. add `shared: resolveApp('shared'),` in paths.js
2. add `'@shared': paths.shared,` in webpack.config.dev.js (attention: we should extract the duplication in webpack.config.dev.js and webpack.config.prod.js, but we don't do this time)

### make alias available in jest.

1. create shared folder and add new component named HelloWorld:

```
// shared/components/HelloWorld/index.js

import React from 'react'

function HelloWorld() {
  return (
    <div>
      hello, world!
    </div>
  )
}

export default HelloWorld
```

2. add third test which ues HelloWorld component inside @shared path:

```
// src/helloWorld.spec.js

import { arrowFunction } from './es6'
import React from 'react'
import HelloWorld from '@shared/components/HelloWorld/'
import renderer from 'react-test-renderer';

it('first test', () => {
  expect(true, true)
})

it('second test with es6 syntax', () => {
  expect('arrowFunction', arrowFunction())
})

it('third test with @shared alias', () => {
  const component = renderer.create(
    <HelloWorld />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})
```
3. yarn jest and get failed:

```
 Cannot find module '@shared/components/HelloWorld/' from 'helloWorld.spec.js'
      
      at Resolver.resolveModule (node_modules/jest-resolve/build/index.js:179:17)
      at Object.<anonymous> (src/helloWorld.spec.js:4:19)

```

4. make jest know this alias in jest configuration:

```
// package.json

"jest": {
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.js?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).js?(x)"
    ],
    "moduleNameMapper": {
      "^@shared(.*)\"?$": "<rootDir>/shared/$1"
    }
  },
```

5. yarn jest and get passed:

```
 PASS  src/helloWorld.spec.js
  ✓ first test (3ms)
  ✓ second test with es6 syntax
  ✓ renders without crashing (10ms)

Snapshot Summary
 › 1 snapshot written in 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   1 added, 1 total
Time:        1.717s
Ran all test suites.
✨  Done in 2.76s.
```

### add css support 

1. add className for our HelloWorld:

```
// shared/components/HelloWorld/index.js

import React from 'react'
import styles from './HelloWorld.css'
function HelloWorld() {
  return (
    <div className="helloWorld">
      hello, world!
    </div>
  )
}

export default HelloWorld
```

2. add css
```
/* shared/components/HelloWorld/HelloWorld.css */

.helloWorld {
  background-color: red;
}
```

3. yarn jest and failed:

```
 ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){.helloWorld {
                                                                                             ^
    SyntaxError: Unexpected token .
      
      at ScriptTransformer._transformAndBuildScript (node_modules/jest-runtime/build/ScriptTransformer.js:289:17)
      at Object.<anonymous> (shared/components/HelloWorld/index.js:2:19)
      at Object.<anonymous> (src/helloWorld.spec.js:3:19)

```

4. enhance our jest configuration:

`yarn add --dev identity-obj-proxy`

```
// package.json

"jest": {
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.js?(x)",
      "<rootDir>/src/**/?(*.)(spec|test).js?(x)"
    ],
    "moduleNameMapper": {
      "^@shared(.*)\"?$": "<rootDir>/shared/$1",
      "\\.(css|scss)$": "identity-obj-proxy"
    }
  },
```

5. yarn jest and failed:

```
 PASS  src/helloWorld.spec.js
  ✓ first test (3ms)
  ✓ second test with es6 syntax (1ms)
  ✓ third test with @shared alias (9ms)

Snapshot Summary
 › 1 snapshot written in 1 test suite.
 › 1 obsolete snapshot found, run with `yarn run jest -- -u` to remove them.

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   1 added, 1 total
Time:        1.577s
Ran all test suites.
error Command failed with exit code 1.

```

6. check snapshot and make test pass:

`yarn run jest -- -u`

```
 PASS  src/helloWorld.spec.js
  ✓ first test (3ms)
  ✓ second test with es6 syntax (1ms)
  ✓ third test with @shared alias (10ms)

Snapshot Summary
 › 1 obsolete snapshot removed.

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   1 passed, 1 total
Time:        0.955s, estimated 1s
Ran all test suites.
✨  Done in 1.87s.

```

### Next?
test assert with Enzyme is comming soon.

