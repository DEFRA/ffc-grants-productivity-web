describe('Start page', () => {
  test('loads page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/start`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Check if you can apply for a Farming Transformation Fund Improving Farm Productivity Grant')
    expect(response.payload).toContain('Use this service to:')
    expect(response.payload).toContain('check if you are eligible to apply for a grant for your project (takes about 5 minutes)')
    expect(response.payload).toContain('check how well your project fits the funding priorities (takes about 15 minutes if you have all the project details)')
    expect(response.payload).toContain('Who can apply')
    expect(response.payload).toContain('You can apply if:')
    expect(response.payload).toContain('you are a farmer and will do the grant-funded work in England')
    expect(response.payload).toContain('you are an agricultural contractor and your business is registered in England')
    expect(response.payload).toContain('Agricultural contractors cannot apply for solar project items.')
    expect(response.payload).toContain('What you can apply for')
    expect(response.payload).toContain('You can apply for up to:')
    expect(response.payload).toContain('40% of estimated costs of farm productivity project items')
    expect(response.payload).toContain('25% of estimated costs for solar project items')
    expect(response.payload).toContain('For farm productivity project items, the maximum grant you can apply for is £500,000. The minimum grant is £25,000 (40% of £62,500).')
    expect(response.payload).toContain(
      'For solar project items, the maximum grant you can apply for is £100,000. The minimum grant is £15,000 (25% of £60,000). You can apply for grant funding to add solar project items (for example a battery) to a solar photovoltaic (PV) system you already have or to buy a new solar PV system.'
    )
    expect(response.payload).toContain(
      'If you want to apply for both farm productivity and solar project grant funding, you must submit 2 separate applications. The maximum grant amount for both projects together is £500,000.'
    )
    expect(response.payload).toContain('If your project is eligible, you will be able to submit your online application to the Rural Payments Agency (RPA).')
    expect(response.payload).toContain('Start now') // button
    expect(response.payload).toContain('Before you start')
    expect(response.payload).toContain('To use the checker, you need:')
    expect(response.payload).toContain('information about your business (for example, number of employees, turnover)')
    expect(response.payload).toContain('information about the project (for example, the impact the project will have)')
    expect(response.payload).toContain('a list of the items you’d like to buy for the project')
    expect(response.payload).toContain('an estimate of the total cost of the items')
    expect(response.payload).toContain('If you do not enter any information for more than 20 minutes, your application will time out and you will have to start again.')
    expect(response.payload).toContain('Problems using the online service')
    expect(response.payload).toContain('If you have any problems using the online service, call the RPA and follow the options for the Farming Transformation Fund scheme.')
    expect(response.payload).toContain('Telephone')
    expect(response.payload).toContain('Telephone: 0300 0200 301')
    expect(response.payload).toContain('Monday to Friday, 9am to 5pm (except public holidays)')
    expect(response.payload).toContain('Find out about call charges')
    expect(response.payload).toContain('Email')
    expect(response.payload).toContain('FTF@rpa.gov.uk')
  })
})
