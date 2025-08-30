// Test script to demonstrate autonomous search decision behavior
// Run with: node test-autonomous-agent.js

const testQueries = [
  // Should search - explicit event requests
  {
    query: "Show me AI events in Brussels",
    expectedSearch: true,
    description: "Explicit search for AI events with location"
  },
  {
    query: "Find startup meetups",
    expectedSearch: true,
    description: "Direct request for specific event type"
  },
  {
    query: "I'm looking for tech conferences next month",
    expectedSearch: true,
    description: "Search request with timeframe"
  },

  // Should NOT search - general questions
  {
    query: "What types of events do you have?",
    expectedSearch: false,
    description: "General question about available event types"
  },
  {
    query: "How do I register for events?",
    expectedSearch: false,
    description: "Question about registration process"
  },
  {
    query: "Hello, how can you help me?",
    expectedSearch: false,
    description: "Greeting and service inquiry"
  },

  // Should NOT search - conversational responses  
  {
    query: "Thanks, that's helpful!",
    expectedSearch: false,
    description: "Appreciation response"
  },
  {
    query: "Tell me more about that",
    expectedSearch: false,
    description: "Follow-up conversation (context dependent)"
  },

  // Should search - recommendation requests
  {
    query: "What should I attend if I'm interested in machine learning?",
    expectedSearch: true,
    description: "Recommendation request with specific interest"
  },
  {
    query: "I'm new to tech, what events would you recommend?",
    expectedSearch: true,
    description: "Personalized recommendation request"
  }
]

async function testAutonomousAgent() {
  console.log('🧪 Testing Autonomous Agent Search Decision Logic')
  console.log('=' .repeat(60))

  const baseUrl = 'http://localhost:3000'
  let passedTests = 0
  let totalTests = testQueries.length

  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i]
    console.log(`\n${i + 1}. ${test.description}`)
    console.log(`Query: "${test.query}"`)
    console.log(`Expected to search: ${test.expectedSearch}`)

    try {
      const response = await fetch(`${baseUrl}/api/autonomous-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: test.query })
      })

      if (!response.ok) {
        console.log(`❌ API Error: ${response.status}`)
        continue
      }

      const result = await response.json()
      const actualSearch = result.searchPerformed
      const eventsFound = result.events?.length || 0

      console.log(`Actual search performed: ${actualSearch}`)
      console.log(`Events found: ${eventsFound}`)
      console.log(`Agent reasoning: ${result.reasoning}`)
      console.log(`Response: ${result.response.substring(0, 100)}${result.response.length > 100 ? '...' : ''}`)

      // Check if the decision matches expectation
      if (actualSearch === test.expectedSearch) {
        console.log('✅ PASS - Search decision correct')
        passedTests++
      } else {
        console.log('❌ FAIL - Search decision incorrect')
        console.log(`   Expected: ${test.expectedSearch}, Got: ${actualSearch}`)
      }

    } catch (error) {
      console.log(`❌ Test Error: ${error.message}`)
    }

    console.log('-'.repeat(50))
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The autonomous agent correctly decides when to search.')
  } else {
    console.log(`⚠️  ${totalTests - passedTests} tests failed. The agent may need tuning.`)
  }
}

// Check if we're running in Node.js environment
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires fetch API. Install node-fetch or run in a modern Node.js version.')
  console.log('Alternative: Test manually using the API endpoints in your browser/Postman')
  console.log('\nExample test queries:')
  testQueries.forEach((test, i) => {
    console.log(`${i + 1}. "${test.query}" (should ${test.expectedSearch ? 'search' : 'not search'})`)
  })
} else {
  testAutonomousAgent().catch(console.error)
}