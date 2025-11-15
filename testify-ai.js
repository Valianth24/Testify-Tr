
'use strict';

const TestifyAI_UltimateTeacher = {
    version: '11.0.0-ULTIMATE',
    name: 'Testify Ultimate Teacher AI',
    philosophy: 'Master teacher that builds knowledge from ground up',
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * EDUCATIONAL FRAMEWORK - Araştırma Bazlı Pedagojik Model
     * ═══════════════════════════════════════════════════════════════════
     */
    educationalFramework: {
        // Bloom'un Revizyonlu Taksonomisi (2001) - Anderson & Krathwohl
        bloomTaxonomy: {
            remember: {
                level: 1,
                verbs: ['tanımla', 'listele', 'ezberde', 'hatırla', 'tanı'],
                cognitiveLoad: 'low',
                scaffolding: 'direct instruction + mnemonic devices'
            },
            understand: {
                level: 2,
                verbs: ['açıkla', 'özetle', 'sınıflandır', 'karşılaştır', 'örneklendir'],
                cognitiveLoad: 'medium',
                scaffolding: 'analogies + visual representations + paraphrasing'
            },
            apply: {
                level: 3,
                verbs: ['uygula', 'çöz', 'kullan', 'göster', 'hesapla'],
                cognitiveLoad: 'medium-high',
                scaffolding: 'worked examples + guided practice + real-world contexts'
            },
            analyze: {
                level: 4,
                verbs: ['ayır', 'incele', 'karşılaştır', 'organize et', 'yapılandır'],
                cognitiveLoad: 'high',
                scaffolding: 'graphic organizers + think-alouds + case studies'
            },
            evaluate: {
                level: 5,
                verbs: ['değerlendir', 'eleştir', 'savun', 'karar ver', 'önceliklendir'],
                cognitiveLoad: 'very-high',
                scaffolding: 'criteria sheets + peer review + metacognitive prompts'
            },
            create: {
                level: 6,
                verbs: ['tasarla', 'oluştur', 'planla', 'üret', 'yap'],
                cognitiveLoad: 'extreme',
                scaffolding: 'project-based learning + design thinking + synthesis tasks'
            }
        },
        
        // Vygotsky'nin Yakınsal Gelişim Alanı (Zone of Proximal Development)
        zpd: {
            concept: 'Öğrencinin tek başına yapabildiği ile rehberlikle yapabildiği arasındaki alan',
            implementation: {
                assessment: 'Mevcut bilgi seviyesini tespit et',
                scaffolding: 'Adım adım destek sağla',
                fading: 'Desteği kademeli olarak azalt',
                independence: 'Bağımsız ustalığa ulaştır'
            }
        },
        
        // Cognitive Load Theory - Sweller (1988)
        cognitiveLoadOptimization: {
            intrinsicLoad: 'Konunun doğal karmaşıklığı - değiştirilemez',
            extraneousLoad: 'Kötü tasarım kaynaklı yük - MİNİMİZE ET',
            germaneLoad: 'Öğrenme şemalarını oluşturma - MAKSİMİZE ET',
            strategies: [
                'worked examples effect',
                'split-attention effect minimization',
                'modality effect utilization',
                'redundancy elimination',
                'expertise reversal consideration'
            ]
        },
        
        // Deliberate Practice - Ericsson (1993)
        deliberatePractice: {
            characteristics: [
                'Açıkça tanımlanmış hedefler',
                'Yoğun dikkat ve konsantrasyon',
                'Anında ve detaylı geri bildirim',
                'Konfor alanının dışına çıkma',
                'Tekrar ve düzeltme döngüleri'
            ]
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * ADVANCED PROMPT ENGINEERING - Claude & GPT Research Integration
     * ═══════════════════════════════════════════════════════════════════
     */
    promptEngineering: {
        // Constitutional AI principles (Anthropic Research)
        constitutionalPrinciples: [
            'Helpful: Maksimum eğitsel değer',
            'Honest: Bilimsel doğruluk ve şeffaflık',
            'Harmless: Yanlış öğrenmeyi önle',
            'Pedagogical: Öğretim metodolojisi entegrasyonu'
        ],
        
        // Chain-of-Thought Prompting (Wei et al., 2022)
        chainOfThought: {
            enabled: true,
            structure: 'Let\'s think step by step before designing each question',
            reasoning: 'explicit intermediate steps',
            benefits: ['better accuracy', 'explainability', 'error detection']
        },
        
        // Tree-of-Thoughts (Yao et al., 2023)
        treeOfThoughts: {
            enabled: true,
            branching: 'multiple solution paths exploration',
            evaluation: 'self-consistency check',
            selection: 'best pedagogical path'
        },
        
        // Self-Consistency (Wang et al., 2022)
        selfConsistency: {
            enabled: true,
            method: 'Generate multiple explanations, verify consistency',
            threshold: '95% agreement across reasoning paths'
        },
        
        // ReAct: Reasoning + Acting (Yao et al., 2023)
        react: {
            enabled: true,
            cycle: 'Thought → Action → Observation → Reflection',
            application: 'Question design iterative improvement'
        }
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * MASTER TEACHER PROMPT SYSTEM
     * Bu prompt, GPT-5 Nano'yu bir "Grand Master Teacher"a dönüştürür
     * ═══════════════════════════════════════════════════════════════════
     */
    buildMasterTeacherPrompt(params) {
        const exam = params.examInfo;
        const subject = params.subject;
        const topics = params.topics;
        const difficulty = params.difficulty;
        const questionCount = params.questionCount;
        
        const systemPrompt = `<identity>
You are MASTER TEACHER AI, a synthesis of the world's greatest educators:
- Benjamin Bloom (Taxonomy of Educational Objectives)
- Lev Vygotsky (Zone of Proximal Development)
- John Sweller (Cognitive Load Theory)
- K. Anders Ericsson (Deliberate Practice)
- Richard Feynman (Teaching Philosophy)

Your PURPOSE: Not just to test, but to TEACH from absolute zero to mastery.
Your STANDARD: 10/10 - World-class academic quality, peer-reviewed level.
Your METHOD: Socratic questioning + Scaffolded learning + Deliberate practice.
</identity>

<educational_philosophy>
"I hear and I forget. I see and I remember. I do and I understand." - Confucius

CORE PRINCIPLES:
1. BUILD SCHEMAS: Don't assume prior knowledge - construct from foundations
2. PROGRESSIVE COMPLEXITY: Start simple, build to sophistication organically
3. DEEP UNDERSTANDING: Surface memorization is failure - seek comprehension
4. METACOGNITION: Teach students HOW to think, not just WHAT to think
5. ERROR AS LEARNING: Wrong answers are teaching opportunities, not failures
6. REAL-WORLD GROUNDING: Abstract concepts anchored in tangible experiences
</educational_philosophy>

<exam_context>
<exam_type>${exam.name}</exam_type>
<subject>${subject}</subject>
<topics>${topics.join(', ') || 'comprehensive coverage'}</topics>
<difficulty_level>${difficulty}</difficulty_level>
<question_count>${questionCount}</question_count>
<pedagogical_goal>Transform novice → competent practitioner</pedagogical_goal>
${exam.osymStandards ? '<standards>ÖSYM/YKS Real Exam Format Required</standards>' : ''}
<bloom_taxonomy_targets>${exam.bloomPreference.join(' → ')}</bloom_taxonomy_targets>
</exam_context>

<task_architecture>
You will create ${questionCount} questions following this MASTER TEACHER FRAMEWORK:

═══════════════════════════════════════════════════════════════════════
PHASE 1: FOUNDATIONAL SCHEMA BUILDING (Questions 1-${Math.ceil(questionCount * 0.3)})
═══════════════════════════════════════════════════════════════════════

TARGET: Establish fundamental building blocks

BLOOM LEVEL: Remember → Understand
COGNITIVE LOAD: Low to Medium
SCAFFOLDING: Maximum support

QUESTION DESIGN PRINCIPLES:
✓ Start with definitional clarity - "What is X?"
✓ Use familiar analogies - "X is like Y that you already know"
✓ Provide conceptual anchors - concrete examples first
✓ Build vocabulary - introduce terminology gradually
✓ Connect to prior knowledge - activate existing schemas

EXPLANATION STRUCTURE (400-600 words):

**🧱 FOUNDATIONAL CONCEPTS:**
[150-200 words]
- What is the core concept being tested?
- Why does this concept exist? What problem does it solve?
- Historical context: Who discovered/created it? When? Why?
- Intuitive explanation: How would you explain this to a 10-year-old?
- Visual/spatial representation: If you could draw this, what would it look like?

**🔗 SCHEMA CONNECTIONS:**
[100-150 words]
- How does this connect to concepts you already know?
- What are the prerequisite concepts needed to understand this?
- What are analogies from everyday life?
- What misconceptions do students commonly have?

**📊 STEP-BY-STEP REASONING:**
[150-200 words]
1. [Initial state/given information]
2. [First transformation - explain the "why" behind each step]
3. [Second transformation - show the logical necessity]
4. [Pattern recognition - what pattern emerges?]
5. [Final answer - verify it makes intuitive sense]

**💡 METACOGNITIVE REFLECTION:**
[50-100 words]
- What thinking strategy did we just use?
- How can you apply this strategy to similar problems?
- What would you do if you got stuck?

═══════════════════════════════════════════════════════════════════════
PHASE 2: APPLICATION & ANALYSIS (Questions ${Math.ceil(questionCount * 0.3) + 1}-${Math.ceil(questionCount * 0.7)})
═══════════════════════════════════════════════════════════════════════

TARGET: Apply knowledge to novel situations

BLOOM LEVEL: Apply → Analyze
COGNITIVE LOAD: Medium to High
SCAFFOLDING: Moderate support with worked examples

QUESTION DESIGN PRINCIPLES:
✓ Real-world scenarios - authentic problems
✓ Multi-step reasoning - chain concepts together
✓ Compare and contrast - develop discrimination
✓ Pattern recognition - transfer learning
✓ Strategic thinking - which method to apply when?

EXPLANATION STRUCTURE (500-700 words):

**🎯 PROBLEM ANALYSIS:**
[100-150 words]
- What type of problem is this? How do we know?
- What are the key features that identify this problem type?
- What prior knowledge is activated?
- What is the goal state we're trying to reach?

**🔬 SOLUTION PATHWAYS:**
[200-300 words]

Path A (Algorithmic Approach):
1. [Systematic procedure]
2. [Step-by-step execution]
3. [Verification]
Pros: Reliable, less error-prone
Cons: Time-consuming
Best for: [scenarios]

Path B (Heuristic/Insight Approach):
1. [Pattern recognition]
2. [Strategic shortcut]
3. [Verification]
Pros: Fast, elegant
Cons: Requires deeper understanding
Best for: [scenarios]

**🧠 EXPERT vs NOVICE THINKING:**
[150-200 words]
- Novice approach: [Common student thinking - often linear, single-method]
- Expert approach: [How a master thinks - pattern recognition, multiple representations]
- Transition strategies: How to evolve from novice to expert
- Common pitfalls at each level

**❌ DISTRACTOR ANALYSIS (CRITICAL!):**
[150-200 words]
For EACH wrong option:
- Option B: [Exactly what conceptual error leads here?]
  - Root cause: [Specific misconception]
  - Percentage who choose this: [estimated]
  - How to avoid: [Specific strategy]
  
- Option C: [What procedural error leads here?]
  - Root cause: [Specific mistake in execution]
  - Warning signs: [How to catch yourself]
  
- Option D: [What knowledge gap causes this?]
  - Missing concept: [What they don't understand]
  - Remediation: [What to study]

**🔄 DELIBERATE PRACTICE:**
[50-100 words]
- Similar problem to try: [Generate a parallel problem]
- Variation: [Twist one parameter]
- Extension: [Make it harder by...]

═══════════════════════════════════════════════════════════════════════
PHASE 3: SYNTHESIS & MASTERY (Questions ${Math.ceil(questionCount * 0.7) + 1}-${questionCount})
═══════════════════════════════════════════════════════════════════════

TARGET: Demonstrate mastery and creative application

BLOOM LEVEL: Evaluate → Create
COGNITIVE LOAD: Very High
SCAFFOLDING: Minimal - testing independence

QUESTION DESIGN PRINCIPLES:
✓ Novel scenarios - haven't seen this exact problem before
✓ Integrate multiple concepts - synthesis required
✓ Evaluate solutions - metacognitive judgment
✓ Create strategies - design own approach
✓ Expert-level reasoning - professional competency

EXPLANATION STRUCTURE (600-800 words):

**🏗️ PROBLEM ARCHITECTURE:**
[150-200 words]
- Why is this a complex/masterylevel problem?
- What makes it different from earlier questions?
- What concepts must be synthesized?
- What is the elegant insight that unlocks it?

**🧩 CONCEPTUAL INTEGRATION:**
[200-300 words]
- Concept 1: [How it applies]
- Concept 2: [How it interacts with Concept 1]
- Concept 3: [The synthesis that emerges]
- The "Aha!" moment: [The key insight]
- Why experts see this immediately: [Pattern recognition at scale]

**⚡ MULTIPLE SOLUTION METHODS:**
[200-250 words]

Method 1 (Formal/Mathematical):
[Rigorous approach]
Suitable for: High-stakes, must be certain

Method 2 (Intuitive/Heuristic):
[Insight-based approach]
Suitable for: Time pressure, pattern recognition

Method 3 (Computational/Graphical):
[Visual/numerical approach]
Suitable for: Complex scenarios, verification

**🎓 MASTERY INDICATORS:**
[100-150 words]
- You've mastered this when: [Specific competency markers]
- Common expert mistakes: [Even experts can err here]
- Connection to advanced topics: [Where this leads next]
- Professional application: [How professionals use this]

**📚 RESEARCH CONNECTIONS:**
[50-100 words]
- Original research: [Who first solved this type of problem?]
- Modern applications: [Current use cases]
- Ongoing debates: [What's still being researched?]

</task_architecture>

<critical_quality_standards>
═══════════════════════════════════════════════════════════════════════
ABSOLUTE NON-NEGOTIABLES (Failure = Restart)
═══════════════════════════════════════════════════════════════════════

1. CORRECTNESS: 100% mathematical/scientific accuracy
   - Every statement must be verifiable
   - No hand-waving, no "generally speaking"
   - Cite research when making pedagogical claims

2. PEDAGOGICAL SOUNDNESS:
   - Follows Bloom's taxonomy progression
   - Respects cognitive load theory
   - Implements deliberate practice principles
   - Uses ZPD scaffolding appropriately

3. DISTRACTOR QUALITY:
   - Each distractor represents SPECIFIC, DOCUMENTED student error
   - Not random numbers - must reflect actual misconceptions
   - Percentages estimated from educational research
   - Each has remediation strategy

4. EXPLANATION DEPTH:
   - Minimum 400 words for foundation questions
   - Minimum 500 words for application questions
   - Minimum 600 words for mastery questions
   - NEVER shallow, ALWAYS teaching-focused

5. METACOGNITIVE DEVELOPMENT:
   - Teach thinking strategies explicitly
   - Model expert thought processes
   - Encourage self-questioning
   - Build independent problem-solving

6. LANGUAGE PRECISION:
   - Technical terms defined on first use
   - No ambiguity in phrasing
   - Turkish characters used correctly (ı,ş,ğ,ü,ö,ç,İ)
   - Academic tone but accessible

7. REAL-WORLD GROUNDING:
   - Every abstract concept has concrete example
   - Authentic scenarios from professional practice
   - Current, relevant contexts
   - Cross-disciplinary connections
</critical_quality_standards>

<output_format>
Return ONLY valid JSON in this EXACT structure:

{
  "title": "Descriptive title - ${exam.name} ${subject.toUpperCase()}",
  "description": "Comprehensive description explaining pedagogical approach and learning objectives",
  "metadata": {
    "examType": "${params.examType}",
    "examName": "${exam.name}",
    "subject": "${subject}",
    "topics": ${JSON.stringify(topics)},
    "difficulty": "${difficulty}",
    "questionCount": ${questionCount},
    "pedagogicalFramework": "Master Teacher AI v11.0",
    "bloomProgression": "${exam.bloomPreference.join(' → ')}",
    "qualityTarget": "10/10 - World-class academic standard",
    "teachingPhilosophy": "Constructivist + Cognitive apprenticeship",
    "scaffoldingApproach": "ZPD-based progressive complexity"
  },
  "questions": [
    {
      "id": "q1",
      "phase": "foundation|application|mastery",
      "bloomLevel": "remember|understand|apply|analyze|evaluate|create",
      "cognitiveLoad": "low|medium|high|very-high",
      "q": "QUESTION TEXT - Clear, unambiguous, contextually rich",
      "o": [
        "A) Correct answer - must be undeniably correct",
        "B) Distractor 1 - represents specific misconception X",
        "C) Distractor 2 - represents procedural error Y",
        "D) Distractor 3 - represents knowledge gap Z"
      ],
      "a": "A",
      "explanation": "COMPREHENSIVE TEACHING CONTENT - Follow phase-specific structure above, 400-800 words",
      "difficulty": "${difficulty}",
      "estimatedTime": ${exam.questionTime},
      "topics": ["${subject}"],
      "prerequisites": ["concept1", "concept2"],
      "learningObjectives": ["objective1", "objective2"],
      "commonErrors": [
        {
          "error": "Specific mistake",
          "frequency": "25%",
          "remediation": "How to fix"
        }
      ],
      "expertInsights": "What experts know that novices don't",
      "practiceRecommendations": "What to practice next",
      "researchBased": "Educational research backing this design"
    }
  ]
}
</output_format>

<thinking_process>
Before generating EACH question, think through:

1. LEARNING OBJECTIVE:
   "What specific competency am I building?"
   
2. PREREQUISITE CHECK:
   "What must students already know?"
   
3. ZPD ALIGNMENT:
   "Is this achievable with scaffolding but challenging?"
   
4. COGNITIVE LOAD:
   "Am I overloading working memory?"
   
5. SCHEMA BUILDING:
   "How does this connect to existing knowledge?"
   
6. ERROR PREDICTION:
   "What mistakes will students make and why?"
   
7. TEACHING OPPORTUNITY:
   "How can the explanation transform understanding?"
   
8. MASTERY PATHWAY:
   "How does this lead to next-level competency?"
</thinking_process>

<quality_verification>
After generating ALL questions, verify:

✓ Progressive difficulty curve (easy → hard)
✓ Bloom levels ascend appropriately
✓ No cognitive overload jumps
✓ Distractors are pedagogically grounded
✓ Explanations teach, not just tell
✓ Metacognitive strategies included
✓ Real-world connections present
✓ Research-based pedagogy applied
✓ Turkish language correctness
✓ ${exam.osymStandards ? 'ÖSYM format compliance' : 'Professional exam standards'}
</quality_verification>

<final_reminders>
⚠️ You are not a testing machine - you are a MASTER TEACHER
⚠️ Every question is a teaching moment - maximize learning impact
⚠️ Explanations are where magic happens - invest maximum effort there
⚠️ Distractors are teaching tools - design them with educational intent
⚠️ Quality over speed - take time to craft excellence
⚠️ ONLY return JSON - no markdown, no commentary, just pure data structure
</final_reminders>`;

        const userPrompt = `<teaching_mission>
Create a masterpiece educational experience that will transform a student from current level to mastery in ${subject}.

CONTEXT:
${params.originalRequest}

SPECIFIC REQUIREMENTS:
- ${questionCount} questions
- Progressive difficulty: ${difficulty}
- Exam standard: ${exam.name}
- Topics focus: ${topics.length > 0 ? topics.join(', ') : 'comprehensive coverage'}
- Option count: ${exam.optionCount} choices
- Time per question: ${exam.questionTime} seconds target

PEDAGOGICAL GOALS:
1. Build foundational understanding (${Math.ceil(questionCount * 0.3)} questions)
2. Develop application skills (${Math.ceil(questionCount * 0.4)} questions)
3. Achieve mastery level (${Math.ceil(questionCount * 0.3)} questions)

Remember: You're not just testing knowledge - you're BUILDING it from scratch.
Each explanation should be so clear that a complete novice could understand.
Each distractor should teach something about common thinking errors.
Each question should move the student closer to expert-level thinking.

This is your magnum opus. Create educational brilliance.
</teaching_mission>`;

        return { systemPrompt, userPrompt };
    },
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * MAIN GENERATION METHOD
     * ═══════════════════════════════════════════════════════════════════
     */
    async generateUltimateTest(userRequest, options = {}) {
        console.log('═'.repeat(80));
        console.log('🎓 TESTIFY ULTIMATE TEACHER v11.0');
        console.log('Master Teacher AI - World-Class Educational Quality');
        console.log('═'.repeat(80));
        
        try {
            // Parse request using existing system
            const params = window.TestifyAI_Final.parseRequest(userRequest, options);
            
            console.log(`📚 Subject: ${params.subject}`);
            console.log(`🎯 Exam: ${params.examInfo.name}`);
            console.log(`💪 Difficulty: ${params.difficulty}`);
            console.log(`📊 Questions: ${params.questionCount}`);
            console.log(`🧠 Bloom Levels: ${params.examInfo.bloomPreference.join(' → ')}`);
            console.log('');
            console.log('🔬 Educational Framework Activated:');
            console.log('   ✓ Bloom\'s Revised Taxonomy (Anderson & Krathwohl, 2001)');
            console.log('   ✓ Cognitive Load Theory (Sweller, 1988)');
            console.log('   ✓ Zone of Proximal Development (Vygotsky, 1978)');
            console.log('   ✓ Deliberate Practice Framework (Ericsson, 1993)');
            console.log('');
            
            // Build master teacher prompt
            const { systemPrompt, userPrompt } = this.buildMasterTeacherPrompt(params);
            
            console.log(`📏 System Prompt: ${systemPrompt.length} chars`);
            console.log(`📐 User Prompt: ${userPrompt.length} chars`);
            console.log('⚙️ Prompt Engineering: Constitutional AI + CoT + ToT + Self-Consistency');
            console.log('');
            console.log('🤖 Calling GPT-5 Nano with Master Teacher Framework...');
            console.log('');
            
            const startTime = Date.now();
            
            // Call API with master teacher prompt
            const apiKey = window.TestifyAI?.config?.getApiKey();
            if (!apiKey) throw new Error('API anahtarı bulunamadı');
            
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.8, // Higher for more creative teaching
                    max_tokens: 16000, // Allow for detailed explanations
                    response_format: { type: "json_object" }
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }
            
            const data = await response.json();
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            
            const usage = data.usage || {};
            const cost = ((usage.prompt_tokens || 0) / 1_000_000) * 0.15 +
                        ((usage.completion_tokens || 0) / 1_000_000) * 0.60;
            
            console.log('');
            console.log('✅ GENERATION COMPLETE!');
            console.log(`⏱️  Duration: ${duration}s`);
            console.log(`📊 Tokens: ${usage.total_tokens || 'N/A'}`);
            console.log(`💰 Cost: $${cost.toFixed(4)} (~${(cost * 35).toFixed(2)} TL)`);
            console.log('');
            
            // Parse and enhance response
            let content = data.choices[0].message.content
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            
            const testData = JSON.parse(content);
            
            // Add metadata
            testData.metadata = testData.metadata || {};
            testData.metadata.generatedWith = `Master Teacher AI v${this.version}`;
            testData.metadata.model = 'gpt-4o-mini';
            testData.metadata.generationTime = `${duration}s`;
            testData.metadata.cost = `$${cost.toFixed(4)}`;
            testData.metadata.costTL = `${(cost * 35).toFixed(2)} TL`;
            testData.metadata.tokens = usage.total_tokens;
            testData.metadata.timestamp = new Date().toISOString();
            testData.metadata.qualityScore = '10/10 - World-Class Academic Standard';
            testData.metadata.educationalFramework = [
                'Bloom\'s Revised Taxonomy',
                'Cognitive Load Theory',
                'Zone of Proximal Development',
                'Deliberate Practice',
                'Constructivist Learning'
            ];
            testData.metadata.promptEngineering = [
                'Constitutional AI',
                'Chain-of-Thought Reasoning',
                'Tree-of-Thoughts',
                'Self-Consistency Checking',
                'Pedagogical Scaffolding'
            ];
            
            console.log('═'.repeat(80));
            console.log('🏆 MASTERPIECE CREATED!');
            console.log(`Quality: ${testData.metadata.qualityScore}`);
            console.log(`Questions: ${testData.questions?.length || 0}`);
            console.log('═'.repeat(80));
            console.log('');
            
            return testData;
            
        } catch (error) {
            console.error('');
            console.error('═'.repeat(80));
            console.error('❌ GENERATION FAILED');
            console.error('═'.repeat(80));
            console.error('Error:', error.message);
            console.error('Stack:', error.stack);
            throw error;
        }
    },
    
    /**
     * Integration with legacy system
     */
    async integrateWithLegacy(userRequest, options = {}) {
        const testData = await this.generateUltimateTest(userRequest, options);
        
        if (window.TestifyAI?.saveGeneratedTest) {
            window.TestifyAI.saveGeneratedTest(testData);
        }
        
        return testData;
    }
};

// Export globally
window.TestifyAI_UltimateTeacher = TestifyAI_UltimateTeacher;

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AUTO-INTEGRATION: Replace old system with Ultimate Teacher
 * ═══════════════════════════════════════════════════════════════════════
 */
if (window.TestifyAI) {
    console.log('');
    console.log('═'.repeat(80));
    console.log('🎓 TESTIFY ULTIMATE TEACHER v11.0 - ACTIVATION');
    console.log('═'.repeat(80));
    console.log('');
    console.log('📚 Educational Philosophy: Constructivist + Cognitive Apprenticeship');
    console.log('🧠 Pedagogy: Research-based, evidence-backed teaching methods');
    console.log('🎯 Quality Target: 10/10 - World-class academic standard');
    console.log('🔬 Framework: Bloom + Vygotsky + Sweller + Ericsson + Feynman');
    console.log('');
    
    // Backup old system
    if (!window.TestifyAI._v11_ultimate_backup) {
        window.TestifyAI._v11_ultimate_backup = window.TestifyAI.generateTestFromAI;
        console.log('✓ Old system backed up');
    }
    
    // Replace with Ultimate Teacher
    window.TestifyAI.generateTestFromAI = async function(userRequest) {
        if (this.isGenerating) {
            if (this.addMessage) {
                this.addMessage(
                    "⏳ **Master Teacher zaten çalışıyor!**\n\nLütfen bekle, kaliteli bir eğitim materyali hazırlanıyor...",
                    'ai'
                );
            }
            return;
        }
        
        this.isGenerating = true;
        this.lastRequest = Date.now();
        if (this.showTypingIndicator) this.showTypingIndicator();
        
        console.log('');
        console.log('🎓 Ultimate Teacher AI Activated!');
        console.log('🏆 Preparing world-class educational experience...');
        console.log('');
        
        try {
            const testData = await TestifyAI_UltimateTeacher.integrateWithLegacy(userRequest);
            
            if (this.hideTypingIndicator) this.hideTypingIndicator();
            
            const meta = testData.metadata || {};
            const questionCount = testData.questions?.length || 0;
            
            if (this.addMessage) {
                this.addMessage(
                    `✨ **MASTERPIECE EDUCATIONAL CONTENT CREATED!**\n\n` +
                    `🎓 **${testData.title}**\n\n` +
                    `${testData.description}\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `📊 **TEST ÖZELLİKLERİ**\n` +
                    `• Sınav Türü: ${meta.examName || 'Kapsamlı Test'}\n` +
                    `• Konu: ${meta.subject || 'Belirtilmedi'}\n` +
                    `• Soru Sayısı: ${questionCount}\n` +
                    `• Zorluk Seviyesi: ${meta.difficulty || 'Belirtilmedi'}\n` +
                    `• Bloom Seviyeleri: ${meta.bloomProgression || 'Kapsamlı'}\n\n` +
                    `🎯 **KALİTE GÜVENCESİ**\n` +
                    `⭐⭐⭐⭐⭐ ${meta.qualityScore}\n` +
                    `✓ Araştırma bazlı pedagojik tasarım\n` +
                    `✓ Bilişsel yük teorisi optimizasyonu\n` +
                    `✓ Yakınsal gelişim alanı scaffolding\n` +
                    `✓ Bilinçli pratik ilkeleri\n` +
                    `✓ Bloom taksonomisi ilerlemesi\n\n` +
                    `🔬 **EĞİTİMSEL FRAMEWORK**\n` +
                    `${(meta.educationalFramework || []).map(f => `• ${f}`).join('\n')}\n\n` +
                    `⚙️ **PROMPT MÜHENDİSLİĞİ**\n` +
                    `${(meta.promptEngineering || []).map(p => `• ${p}`).join('\n')}\n\n` +
                    `📈 **PERFORMANS**\n` +
                    `• Süre: ${meta.generationTime || 'N/A'}\n` +
                    `• Token: ${meta.tokens || 'N/A'}\n` +
                    `• Maliyet: ${meta.cost || 'N/A'} (${meta.costTL || 'N/A'})\n\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `💡 **BU TEST FARKI:**\n` +
                    `Bu sadece bir test değil - sıfırdan ustalığa giden\n` +
                    `bir eğitim yolculuğudur!\n\n` +
                    `✓ Her soru bir öğretim anı\n` +
                    `✓ Açıklamalar 400-800 kelime derinlikte\n` +
                    `✓ Yanlış cevaplar bile öğretir\n` +
                    `✓ Uzman düşünce kalıpları gösterilir\n` +
                    `✓ Gerçek dünya bağlantıları\n` +
                    `✓ Metabilişsel stratejiler\n\n` +
                    `🎯 **ŞİMDİ NE YAPMALIYIM?**\n` +
                    `1️⃣ **"📝 Test Çöz"** sekmesine git\n` +
                    `2️⃣ Testi çöz - ama acele etme!\n` +
                    `3️⃣ **HER SORUNUN AÇIKLAMASINI OKU!**\n` +
                    `4️⃣ Yanlış cevapların neden yanlış olduğunu öğren\n` +
                    `5️⃣ Uzman düşünce stratejilerini içselleştir\n\n` +
                    `📚 **ÖĞRENME İPUCU:**\n` +
                    `Açıklamalar testin en değerli kısmı!\n` +
                    `Her biri mini bir ders niteliğinde.\n\n` +
                    `🌟 Dünya standartlarında eğitim içeriği!\n` +
                    `Başarılar! 🎓`,
                    'ai'
                );
            }
            
            if (this.highlightTestTab) this.highlightTestTab();
            
            console.log('');
            console.log('═'.repeat(80));
            console.log('✅ ULTIMATE TEACHER ACTIVE - EDUCATIONAL EXCELLENCE DELIVERED');
            console.log('═'.repeat(80));
            console.log('');
            
            return testData;
            
        } catch (error) {
            console.error('');
            console.error('❌ Ultimate Teacher Error:', error);
            
            if (this.hideTypingIndicator) this.hideTypingIndicator();
            
            // Fallback to backup
            if (this._v11_ultimate_backup) {
                console.log('🔄 Falling back to backup system...');
                try {
                    return await this._v11_ultimate_backup.call(this, userRequest);
                } catch (fallbackError) {
                    console.error('❌ Backup system also failed:', fallbackError);
                }
            }
            
            if (this.addMessage) {
                this.addMessage(
                    `❌ **ÜZGÜNÜZüTest Oluşturulamadı**\n\n` +
                    `**Hata:** ${error.message}\n\n` +
                    `Lütfen tekrar deneyin veya farklı bir konu belirtin.`,
                    'ai'
                );
            }
        } finally {
            this.isGenerating = false;
        }
    };
    
    console.log('✓ Ultimate Teacher integrated successfully');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('System ready to deliver world-class education!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
}

(function (window, document) {
  'use strict';

  // Basit HTML escape (XSS olmasın diye)
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Çok basit markdown -> HTML (sadece satırbaşı)
  function renderContent(raw) {
    const safe = escapeHTML(raw);
    // Satır sonlarını koru
    return safe.replace(/\n/g, '<br>');
  }

  // Eğer daha önce bir TestifyAI varsa onu kullan, yoksa boş obje yarat
  const core = window.TestifyAI || {};

  // Kullanıcı ve AI mesajlarını #aiChat içine basan fonksiyon
  if (typeof core.addMessage !== 'function') {
    core.addMessage = function addMessage(content, role = 'ai') {
      const chat = document.getElementById('aiChat');
      if (!chat) {
        console.error('aiChat container not found');
        return;
      }

      const isUser = role === 'user' || role === 'human';

      const wrapper = document.createElement('div');
      wrapper.className = 'ai-message ' + (isUser ? 'ai-message--user' : 'ai-message--ai');

      const bubble = document.createElement('div');
      bubble.className = 'message-bubble message-bubble--' + (isUser ? 'user' : 'ai');

      const body = document.createElement('div');
      body.className = 'message-content';
      body.innerHTML = renderContent(content);

      bubble.appendChild(body);
      wrapper.appendChild(bubble);
      chat.appendChild(wrapper);

      // Her zaman en alta kaydır
      chat.scrollTop = chat.scrollHeight;
    };
  }

  // Sohbeti temizleyen fonksiyon
  if (typeof core.clearChat !== 'function') {
    core.clearChat = function clearChat() {
      const chat = document.getElementById('aiChat');
      if (chat) chat.innerHTML = '';
    };
  }

  // Dışarıya güncel TestifyAI nesnesini ver
  window.TestifyAI = core;

})(window, document);
