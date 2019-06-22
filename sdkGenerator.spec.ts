import * as Models from "./sdkModels";
import { SdkGenerator } from "./sdkGenerator";
import {PythonFormatter} from "./python.fmt";


describe('ts template test', () => {
  it ('outputs a method in Python', () => {

    const apiModel = Models.ApiModel.fromFile('./Looker.3.1.oas.json')
    const gen = new SdkGenerator(apiModel, new PythonFormatter())
    const result = gen.codeFormatter.declareMethod('  ', apiModel.methods['create_look'])
    expect(result).toBeDefined()
  })

  it('resolves OAS schemas into types', () => {
    const apiModel = Models.ApiModel.fromFile('./Looker.3.1.oas.json')
    expect(typeof apiModel.types['ValidationError'].elementType).toEqual('undefined')

    const test = apiModel.types.ValidationError.properties.errors.type.elementType
    expect(test && test.name).toEqual('ValidationErrorDetail')
  })

  it('loads a method with a ref type response', () => {
    const apiModel = Models.ApiModel.fromFile('./Looker.3.1.oas.json')
    const method = apiModel.methods['user']
    expect(method.primaryResponse.statusCode).toEqual('200')
    expect(method.primaryResponse.type.name).toEqual('User')
    expect(method.type.name).toEqual('User')
    expect(method.endpoint).toEqual('/users/{user_id}')
    const response = method.responses.find((a) => a.statusCode === '400')
    expect(response).toBeDefined()
    if (response) {
      expect(response.type.name).toEqual('Error')
    }
  })

  it('loads 204 methods with void response type', () => {
    const apiModel = Models.ApiModel.fromFile('./Looker.3.1.oas.json')
    const method = apiModel.methods['delete_group_user']
    expect(method.primaryResponse.statusCode).toEqual('204')
    expect(method.primaryResponse.type.name).toEqual('void')
  })
})
