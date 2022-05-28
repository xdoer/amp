#!/usr/bin/env node

import startPack from '@amp/build'
import cmd from './parseCommand'

function main() {
  startPack(cmd())
}

main()
