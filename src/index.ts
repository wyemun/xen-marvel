import cluster from 'cluster'
import os from 'os'
import App from './App'
import Locals from './providers/Locals'
import dotenv from 'dotenv'

/**
 * Init local .env
 */
dotenv.config() // TODO conditional for dev only

/**
 * Make use of multi core CPU to scale up app instances
 */
if (Locals.config().clusterMode && cluster.isPrimary) {
  const CPUS: any = os.cpus()

  CPUS.forEach(() => cluster.fork())
} else {
  void App.init()
}