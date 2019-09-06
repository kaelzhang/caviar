const assert = require('assert')
const delay = require('delay')
const {SyncHook} = require('tapable')

const {Block} = require('../../../..')

class FooBlock extends Block {
  constructor () {
    super()

    const config = {
      foo: {
        type: process.env.MIXER_INVALID_CONFIG_GETTER_TYPE
          ? 'invalid'
          : 'bailTop'
      }
    }

    if (process.env.MIXER_CONFIG_NOT_OPTIONAL) {
      config.foo2 = {
        type: 'bailTop'
      }
    }

    this.config = config

    this.hooks = {
      a: new SyncHook(['foo'])
    }

    if (process.env.INVALID_PHASES) {
      this.phases = 1
    } else {
      this.phases = ['default']
    }
  }
}

if (!process.env.CREATE_NOT_IMPLEMENTED) {
  FooBlock.prototype.create = function (config) {
    return {
      foo: config.foo === 'foo'
    }
  }
}

if (!process.env.RUN_NOT_IMPLEMENTED) {
  FooBlock.prototype.run = async function run ({foo}) {
    assert(this.created.foo === true, 'block: this.created')

    await delay(100)

    this.hooks.a.call(foo)

    return {
      foo
    }
  }
}

module.exports = FooBlock