/**
 * @description 用于检验、构建和改变AST树的节点
 * @docsUrl https://www.npmjs.com/package/babel-types
 */
import * as t from 'babel-types'
/**
 * @description 根据AST生成代码
 * @docsUrl https://www.npmjs.com/package/better-babel-generator
 */
import generate from 'better-babel-generator'

import babylonConfig from '../config/babylon'
/**
 * @description 辅助函数，用于从字符串形式的代码来构建AST树节点
 * @docsUrl https://www.npmjs.com/package/babel-template
 */
const template = require('babel-template')

/**
 * @description 把对象转换成Ast表达式
 * @param obj 
 */
export function convertObjectToAstExpression (obj: object): t.ObjectProperty[] {
  const objArr = Object.keys(obj).map(key => {
    const value = obj[key]
    if (typeof value === 'string') {
      return t.objectProperty(t.stringLiteral(key), t.stringLiteral(value))
    }
    if (typeof value === 'number') {
      return t.objectProperty(t.stringLiteral(key), t.numericLiteral(value))
    }
    if (typeof value === 'boolean') {
      return t.objectProperty(t.stringLiteral(key), t.booleanLiteral(value))
    }
    if (Array.isArray(value)) {
      return t.objectProperty(t.stringLiteral(key), t.arrayExpression(convertArrayToAstExpression(value as [])))
    }
    if (value === null) {
      return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
    }
    if (typeof value === 'object') {
      return t.objectProperty(t.stringLiteral(key), t.objectExpression(convertObjectToAstExpression(value)))
    }
    return t.objectProperty(t.stringLiteral(key), t.nullLiteral())
  })
  return objArr
}

// 最低限度的转义： https://github.com/mathiasbynens/jsesc#minimal
export function generateMinimalEscapeCode (ast: t.File) {
  return generate(ast, {
    jsescOption: {
      minimal: true
    }
  }).code
}

/**
 * @description 把数组转换成Ast表达式
 * @param obj
 */
export function convertArrayToAstExpression (arr: any[]): any[] {
  return arr.map(value => {
    if (typeof value === 'string') {
      return t.stringLiteral(value)
    }
    if (typeof value === 'number') {
      return t.numericLiteral(value)
    }
    if (typeof value === 'boolean') {
      return t.booleanLiteral(value)
    } 
    if (Array.isArray(value)) {
      return convertArrayToAstExpression(value)
    }
    if (typeof value === 'object') {
      return t.objectExpression(convertObjectToAstExpression(value))
    }
    return t.nullLiteral()
  })
}
/**
 * @description 把字符串转换成Ast表达式
 * @param obj
 */
export function convertSourceStringToAstExpression (str: string, opts: object = {}) {
  return template(str, Object.assign({}, babylonConfig, opts))()
}
/**
 * @description Ast表达式转换成变量
 * @param obj
 */
export function convertAstExpressionToVariable (node) {
  if (t.isObjectExpression(node)) {
    const obj = {}
    const properties = node.properties
    properties.forEach(property => {
      if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
        const key = convertAstExpressionToVariable(property.key)
        const value = convertAstExpressionToVariable(property.value)
        obj[key] = value
      }
    })
    return obj
  } else if (t.isArrayExpression(node)) {
    return node.elements.map(convertAstExpressionToVariable)
  } else if (t.isLiteral(node)) {
    return node['value']
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    const name = node.name
    return name === 'undefined'
      ? undefined
      : name
  } else if (t.isJSXExpressionContainer(node)) {
    return convertAstExpressionToVariable(node.expression)
  }
}

/**
 * 获取对象关键字
 * @param node 
 */
export const getObjKey = (node) => {
  if (t.isIdentifier(node)) {
    return node.name
  } else {
    return node.value
  }
}
