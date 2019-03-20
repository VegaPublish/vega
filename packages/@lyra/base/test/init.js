import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import pluginLoader from '@lyra/plugin-loader'

pluginLoader({
  overrides: {
    'config:lyra': [{api: {dataset: 'hei'}}]
  }
})

chai.should()
chai.use(chaiAsPromised)
