jest.unmock('joi')
jest.unmock('../post-manager')

const postManager = require('../post-manager')

describe('POST /api/managers', () => {
  let request
  let reply
  beforeEach(() => {
    const server = {
      app: {
        models: {
          Manager: {
            create: jest.fn(obj => Promise.resolve(obj))
          }
        }
      }
    }

    request = { server }
    reply = jest.fn()
  })

  it('should return created manager', async () => {
    // Given
    expect.assertions(2)
    request.payload = {
      firstName: 'foo',
      lastName: 'bar',
      clientId: 'hello'
    }

    // When
    await postManager.handler(request, reply)

    // Then
    expect(request.server.app.models.Manager.create).toHaveBeenCalledWith(request.payload)
    expect(reply).toHaveBeenCalledWith(request.payload)
  })
})