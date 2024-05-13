import child_process from "node:child_process";

class SpawnProcessBuilder{
  constructor(childProcess) {
    this._processName = childProcess
    this.args = []
  }

  get processName() {
    return this._processName
  }

  add(...args){
    for(const arg of args) {
      if(arg) this.args.push(arg)
    }
    return this
  }

  argsToString() {
    return this.args.join(' ')
  }

  run() {
    this.process = child_process.spawn(this.processName, this.args)
    return this
  }
}

export {
  SpawnProcessBuilder
}