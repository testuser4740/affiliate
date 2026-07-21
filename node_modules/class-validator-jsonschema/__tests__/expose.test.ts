// tslint:disable:no-submodule-imports
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { validationMetadatasToSchemas } from '../src'
const { defaultMetadataStorage } = require('class-transformer/cjs/storage')

// @ts-ignore unused
class User {
  @IsString()
  id: string

  @Expose({ name: 'domain_id' })
  @IsString()
  domainId: string
}

describe('Expose() decorator', () => {
  it('rename Expose()-decorated properties from output schema', () => {
    const schema = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
    })

    expect(schema).toEqual({
      User: {
        properties: {
          id: { type: 'string' },
          domain_id: { type: 'string' },
        },
        type: 'object',
        required: ['id', 'domain_id'],
      },
    })
  })
})
