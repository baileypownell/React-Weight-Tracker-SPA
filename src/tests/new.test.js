
// describe breaks your test suite into components. Depending on your test strategy, you might have a describe for each function in your class, each module of your plugin, or each user-facing piece of functionality.
// describe creates a block that groups together several related tests into one "suite"

// it is where you perform individual tests. You should be able to describe each test like a little sentence, such as "it calculates the area when the radius is set". It creates a single unit test; it's alias? "test"

// Jest uses "matchers" like .toBe() and .toEqual() and toBeNull() that you use in the expect() function

describe('name of test', () => {
    beforeAll(() => {
        /* Runs before all tests */
    })
    afterAll(() => {
        /* Runs after all tests */
    })
    beforeEach(() => {
        /* Runs before each test */
    })
    afterEach(() => {
        /* Runs after each test */
    })

    test('should do some thing', () => {
        expect()
    });
})
