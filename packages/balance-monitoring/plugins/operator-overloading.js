const template = require('@babel/template').default;
<<<<<<< HEAD
const { NodePath } = require('@babel/traverse');
const { Node } = require('@babel/types');
=======
const { NodePath, PluginPass } = require('@babel/core');
const BabelTypes = require('@babel/types');
>>>>>>> main

const OperatorOverloadDirectiveName = 'operator-overloading';

const methodMap = {
  '+': 'add',
  '-': 'sub',
  '*': 'mul',
  '/': 'div'
};

/**
<<<<<<< HEAD
 * @param {Node} node
 * @param {{[key: string]: boolean;}} declarations
 * @param {Array<string>} classNames
 * @return {boolean}
 */
function checkBigDecimalReturn(node, declarations, classNames) {
=======
 * @param {BabelTypes.Node} node
 * @param {{[key: string]: string;}} declarations
 * @param {Array<string>} classNames
 * @return {boolean}
 */
function checkClassNameReturn(node, declarations, classNames) {
>>>>>>> main
  let leftNode = node.left;
  while (leftNode) {
    switch (leftNode.type) {
      case 'NewExpression':
<<<<<<< HEAD
        if (classNames.includes(leftNode.callee.name)) return true;

      case 'Identifier':
        if (declarations[leftNode.name]) return true;
=======
        if (classNames.includes(leftNode.callee.name)) return leftNode.callee.name;

      case 'Identifier':
        const className = declarations[leftNode.name];
        if (className) return className;
>>>>>>> main
    }

    leftNode = leftNode.left;
  }
  return false;
}

/**
<<<<<<< HEAD
 * @param {Node} node
 * @return {Node}
 */
function createBinaryTemplate(node) {
  return template(`() => {
    '${OperatorOverloadDirectiveName} disabled'    
    return LHS.${methodMap[node.operator]}(RHS)
  }`)({
    LHS: assignNode(node.left),
    RHS: assignNode(node.right)
=======
 * @param {BabelTypes.Node} node
 * @param {string} className
 * @return {BabelTypes.Node}
 */
function createBinaryTemplate(node, className) {
  const LHS = node.left.type === 'BinaryExpression' ? createBinaryTemplate(node.left, className) : node.left;
  const RHS = node.right.type === 'BinaryExpression' ? createBinaryTemplate(node.right, className) : node.right;
  const lhsAssign = node.left.type.endsWith('Literal') ? `new ${className}(LHS)` : 'LHS';
  return template(`${lhsAssign}.${methodMap[node.operator]}(RHS)`)({
    LHS,
    RHS
>>>>>>> main
  }).expression;
}

/**
<<<<<<< HEAD
 * @param {Node} node
 * @return {Node}
 */
function assignNode(node) {
  return node.type === 'BinaryExpression'
    ? template(`LHS.${methodMap[node.operator]}(RHS)`)({
        LHS: assignNode(node.left),
        RHS: assignNode(node.right)
      }).expression
    : node;
}

function hasDirective(directives, name, values) {
  for (const directive of directives) {
    if (directive.value.value.startsWith(name)) {
      const setting = directive.value.value.substring(name.length).trim().toLowerCase();
      return values[setting];
    }
  }
  return undefined;
}

function hasOverloadingDirective(directives) {
  return hasDirective(directives, OperatorOverloadDirectiveName, { enabled: true, disabled: false });
}

module.exports = function ({ types: t }) {
  return {
    // pre(state) {
    //   // polyfill BigDecimal
    //   const expressionStatement = template(`() => {
    //     globalThis.BigDecimal = require('@oraichain/oraidex-common').BigDecimal;
    //   }`)();

    //   state.ast.program.body.unshift(t.callExpression(expressionStatement.expression, []));
    // },
=======
 * @param {{ types: BabelTypes }} t
 * @return {BabelTypes.Node}
 */
module.exports = function ({ types: t }) {
  return {
>>>>>>> main
    visitor: {
      Program: {
        /**
         * @param {NodePath} path
<<<<<<< HEAD
         */
        enter(path, state) {
          if (!state._map.has(OperatorOverloadDirectiveName)) {
            state._map.set(OperatorOverloadDirectiveName, {
              directives: [],
=======
         * @param {PluginPass} state
         */
        enter(path, state) {
          if (!state.get(OperatorOverloadDirectiveName)) {
            state.set(OperatorOverloadDirectiveName, {
>>>>>>> main
              classNames: state.opts.classNames ?? [],
              declarations: {}
            });
          }
<<<<<<< HEAD

          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);

          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              operatorOverloadState.directives.unshift(true);
              break;
            case false:
              operatorOverloadState.directives.unshift(false);
              break;
            default:
              // Default to false.
              operatorOverloadState.directives.unshift(state.opts.enabled ?? false);
              break;
          }
        },
        exit(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          if (hasOverloadingDirective(path.node.directives) !== false) {
            operatorOverloadState.directives.shift();
          }
        }
      },

      BlockStatement: {
        /**
         * @param {NodePath} path
         */
        enter(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
              operatorOverloadState.directives.unshift(true);
              break;
            case false:
              operatorOverloadState.directives.unshift(false);
              break;
          }
        },
        /**
         * @param {NodePath} path
         */
        exit(path, state) {
          const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
          switch (hasOverloadingDirective(path.node.directives)) {
            case true:
            case false:
              operatorOverloadState.directives.shift();
              break;
          }
        }
      },
      /**
       * @param {NodePath} path
       */
      VariableDeclaration(path, state) {
        const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
=======
        }
      },

      /**
       * @param {NodePath} path
       * @param {PluginPass} state
       */
      VariableDeclaration(path, state) {
        const { declarations, classNames } = state.get(OperatorOverloadDirectiveName);

>>>>>>> main
        for (const d of path.node.declarations) {
          if (!d.init) continue;
          switch (d.init.type) {
            case 'NewExpression':
<<<<<<< HEAD
              if (operatorOverloadState.classNames.includes(d.init.callee.name)) {
                operatorOverloadState.declarations[d.id.name] = true;
=======
              if (classNames.includes(d.init.callee.name)) {
                declarations[d.id.name] = d.init.callee.name;
>>>>>>> main
              }
              break;

            case 'BinaryExpression':
<<<<<<< HEAD
              if (checkBigDecimalReturn(d.init, operatorOverloadState.declarations, operatorOverloadState.classNames)) {
                operatorOverloadState.declarations[d.id.name] = true;
=======
              const className = checkClassNameReturn(d.init, declarations, classNames);
              if (className) {
                declarations[d.id.name] = className;
>>>>>>> main
              }
              break;
          }
        }
      },

      /**
       * @param {NodePath} path
<<<<<<< HEAD
       */
      BinaryExpression(path, state) {
        const operatorOverloadState = state._map.get(OperatorOverloadDirectiveName);
        if (!operatorOverloadState.directives[0] || !methodMap[path.node.operator]) {
          return;
        }

        if (checkBigDecimalReturn(path.node, operatorOverloadState.declarations, operatorOverloadState.classNames)) {
          const expressionStatement = createBinaryTemplate(path.node);
          path.replaceWith(t.callExpression(expressionStatement, []));
=======
       * @param {PluginPass} state
       */
      BinaryExpression(path, state) {
        if (!methodMap[path.node.operator]) {
          return;
        }

        const { declarations, classNames } = state.get(OperatorOverloadDirectiveName);
        const className = checkClassNameReturn(path.node, declarations, classNames);
        if (className) {
          const expressionStatement = createBinaryTemplate(path.node, className);
          path.replaceWith(t.expressionStatement(expressionStatement, []));
>>>>>>> main
        }
      }
    }
  };
};
