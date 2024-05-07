import child_process from "node:child_process";

class SpawnProcessBuilder{
  constructor(childProcess) {
    this._childProcess = childProcess
    this.args = []
  }

  get process() {
    return this._childProcess
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
    this.child = child_process.spawn(this.process, this.args)

    return this
  }

  on(event, cb){
    this.child.stdout.on(event, cb)
    return this
  }

  onError(event, cb) {
    this.child.stderr.on(event, cb)
    return this
  }

}

export {
  SpawnProcessBuilder
}