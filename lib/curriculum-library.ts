/**
 * Pre-loaded curriculum library.
 *
 * Content is original and aligned with internationally recognised curriculum
 * frameworks including OpenStax (CC-BY), CK-12 (CC-BY-SA), UNESCO IBE
 * curriculum guides, and NCERT (India) — all freely available and used in
 * UNICEF / UNESCO education programmes globally.
 *
 * Bundled in-app so it works instantly with no network calls at agent setup time.
 */

export interface CurriculumEntry {
  id: string;
  subject: string;        // matches agent subject field
  grades: number[];       // e.g. [1,2,3] — grade numbers covered
  title: string;
  description: string;    // one-liner shown in library list
  source: string;         // attribution
  content: string;        // curriculum summary used as agent context
}

export interface TrustedSource {
  id: string;
  title: string;
  organization: string;
  badge: string;
  url: string;
  subject: string;
  grades: number[];
  description: string;
}

// ─── Trusted Quick-Add Sources ────────────────────────────────────────────────
// Real URLs from peer-reviewed, openly licensed, UN-endorsed organisations.
// Teachers click "Fetch" to pull live content via the existing URL extractor.

export const TRUSTED_SOURCES: TrustedSource[] = [
  // ── Mathematics ──
  {
    id: "openstax-prealgebra",
    title: "Prealgebra 2e — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/prealgebra-2e/pages/1-introduction",
    subject: "Mathematics",
    grades: [5, 6, 7, 8],
    description: "Peer-reviewed prealgebra textbook used globally. Covers whole numbers through basic algebra.",
  },
  {
    id: "openstax-elem-algebra",
    title: "Elementary Algebra 2e — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/elementary-algebra-2e/pages/1-introduction",
    subject: "Mathematics",
    grades: [7, 8, 9, 10],
    description: "Foundations of algebra including linear equations, graphing, and polynomials.",
  },
  {
    id: "openstax-alg-trig",
    title: "Algebra & Trigonometry 2e — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-introduction",
    subject: "Mathematics",
    grades: [10, 11, 12],
    description: "Comprehensive algebra through trigonometry for upper secondary students.",
  },
  {
    id: "openstax-stats",
    title: "Introductory Statistics — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/introductory-statistics/pages/1-introduction",
    subject: "Mathematics",
    grades: [10, 11, 12],
    description: "Descriptive and inferential statistics, probability, and data analysis.",
  },
  // ── Science ──
  {
    id: "openstax-bio2e",
    title: "Biology 2e — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/biology-2e/pages/1-introduction",
    subject: "Science",
    grades: [9, 10, 11, 12],
    description: "Comprehensive biology from cells to ecosystems. Widely adopted internationally.",
  },
  {
    id: "openstax-concepts-bio",
    title: "Concepts of Biology — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/concepts-of-biology/pages/1-introduction",
    subject: "Science",
    grades: [7, 8, 9],
    description: "Accessible biology introduction covering life processes, genetics, and ecology.",
  },
  {
    id: "openstax-chemistry",
    title: "Chemistry 2e — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/chemistry-2e/pages/1-introduction",
    subject: "Science",
    grades: [10, 11, 12],
    description: "From atomic structure to chemical reactions and thermodynamics.",
  },
  {
    id: "openstax-physics",
    title: "University Physics Vol. 1 — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/university-physics-volume-1/pages/1-introduction",
    subject: "Science",
    grades: [11, 12],
    description: "Mechanics, waves, and thermodynamics at upper secondary / pre-university level.",
  },
  // ── History ──
  {
    id: "openstax-world-hist-1",
    title: "World History Vol. 1 — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/world-history-volume-1/pages/1-introduction",
    subject: "History",
    grades: [7, 8, 9, 10],
    description: "Prehistory through the 15th century — ancient civilisations to medieval world.",
  },
  {
    id: "openstax-world-hist-2",
    title: "World History Vol. 2 — Introduction",
    organization: "OpenStax / Rice University",
    badge: "CC-BY",
    url: "https://openstax.org/books/world-history-volume-2/pages/1-introduction",
    subject: "History",
    grades: [9, 10, 11, 12],
    description: "15th century to present — colonialism, world wars, and modern global history.",
  },
];

// ─── Bundled Curriculum Entries ───────────────────────────────────────────────

export const CURRICULUM_LIBRARY: CurriculumEntry[] = [

  // ══════════════════════════════════════════════════════
  // MATHEMATICS
  // ══════════════════════════════════════════════════════

  {
    id: "math-1-3-number-sense",
    subject: "Mathematics",
    grades: [1, 2, 3],
    title: "Counting & Number Sense",
    description: "Place value, comparing numbers, and counting patterns up to 1,000",
    source: "Aligned with CK-12 Grade 1–3 Mathematics (CC-BY-SA) and UNESCO IBE Curriculum Framework",
    content: `Number sense is the foundation of all mathematics. It means understanding what numbers are, how they relate to each other, and how they behave when we use them.

Counting: Students begin by counting objects one by one. They learn to count forward and backward starting from any number, not just from 1. Skip counting — counting by 2s, 5s, and 10s — helps students see patterns and prepares them for multiplication.

Place value: Our number system is built on groups of ten. In the number 345, the digit 3 means 3 hundreds (300), the 4 means 4 tens (40), and the 5 means 5 ones. Understanding place value means knowing that the position of a digit determines its value.

Comparing numbers: We use the symbols > (greater than), < (less than), and = (equal to) to compare numbers. To compare 47 and 52, we first look at the tens digit: 4 tens is less than 5 tens, so 47 < 52.

Number patterns: Patterns appear everywhere in mathematics. An odd number always ends in 1, 3, 5, 7, or 9. An even number always ends in 0, 2, 4, 6, or 8. Recognising patterns helps students predict what comes next.

Ordinal numbers: First, second, third, fourth — these tell us position or order, not quantity.

Number lines: A number line shows numbers in order from left to right. We can use it to compare numbers, count, and later to add and subtract.

Real-world connection: Number sense is used every day — counting money, telling the time, measuring ingredients, or knowing which line at the shop is shorter. Building a strong number sense early makes every future maths topic easier.`,
  },

  {
    id: "math-1-3-addition-subtraction",
    subject: "Mathematics",
    grades: [1, 2, 3],
    title: "Addition & Subtraction",
    description: "Adding and subtracting whole numbers up to 1,000, including regrouping",
    source: "Aligned with CK-12 Grade 1–3 Mathematics (CC-BY-SA) and NCERT Primary Mathematics",
    content: `Addition means combining two or more groups to find a total. Subtraction means taking one amount away from another to find the difference.

Basic facts: Students learn addition and subtraction facts up to 20 by heart. Knowing that 7 + 8 = 15 and 15 − 8 = 7 without calculating saves time and mental energy for harder problems.

Addition strategies: The commutative property tells us that 4 + 9 is the same as 9 + 4. We can count on from the larger number, use doubles (6 + 6 = 12, so 6 + 7 = 13), or make tens (8 + 5 = 8 + 2 + 3 = 13).

Subtraction strategies: Subtraction can mean "take away" (I had 9 apples and ate 3, how many left?) or "find the difference" (how much more is 9 than 3?). Counting up from the smaller number is often easier than counting back.

Regrouping (carrying and borrowing): When adding 47 + 35, the ones column gives 7 + 5 = 12. We write the 2 in the ones place and carry the 1 ten to the tens column. When subtracting 52 − 37, we borrow a ten from the tens column to make the ones calculation possible.

Multi-digit addition and subtraction: We always line up digits by place value — ones under ones, tens under tens, hundreds under hundreds — before calculating.

Word problems: Reading a word problem carefully to decide whether to add or subtract is a key skill. Words like "altogether," "total," and "in all" usually signal addition. Words like "left," "fewer," and "difference" usually signal subtraction.`,
  },

  {
    id: "math-4-6-multiplication-division",
    subject: "Mathematics",
    grades: [4, 5, 6],
    title: "Multiplication & Division",
    description: "Times tables, long multiplication, long division, factors and multiples",
    source: "Aligned with CK-12 Grade 4–6 Mathematics (CC-BY-SA) and Cambridge Primary Curriculum",
    content: `Multiplication is repeated addition. 4 × 6 means four groups of six, or 6 + 6 + 6 + 6 = 24. Division is the opposite — splitting a quantity into equal groups.

Times tables: Knowing multiplication facts from 1 × 1 to 12 × 12 is essential. Patterns help: any number times 0 is 0, any number times 1 is itself, times 2 doubles the number, times 10 adds a zero in the ones place.

Properties of multiplication: The commutative property says 3 × 7 = 7 × 3. The associative property says (2 × 3) × 4 = 2 × (3 × 4). The distributive property says 6 × 13 = 6 × 10 + 6 × 3 = 60 + 18 = 78. These properties make mental maths faster.

Long multiplication: To multiply 47 × 23, we break it into 47 × 20 and 47 × 3, then add the results. Written method: multiply each digit of the bottom number by the whole top number, shifting one place left for each column.

Factors and multiples: Factors of 12 are the numbers that divide evenly into 12: 1, 2, 3, 4, 6, 12. Multiples of 4 are 4, 8, 12, 16, 20… The highest common factor (HCF) and lowest common multiple (LCM) are used in fractions.

Long division: To divide 156 ÷ 12, we ask "how many times does 12 go into 156?" Working digit by digit: 12 goes into 15 once (12), remainder 3. Bring down the 6 to get 36. 12 goes into 36 three times. Answer: 13.

Remainders: Sometimes division does not give a whole number. 17 ÷ 5 = 3 remainder 2, or 3.4 as a decimal.`,
  },

  {
    id: "math-4-6-fractions-decimals",
    subject: "Mathematics",
    grades: [4, 5, 6],
    title: "Fractions & Decimals",
    description: "Equivalent fractions, operations with fractions, decimal place value",
    source: "Aligned with OpenStax Prealgebra 2e (CC-BY) and CK-12 Grade 4–6 Mathematics",
    content: `A fraction represents a part of a whole. The denominator (bottom number) tells how many equal parts the whole is divided into. The numerator (top number) tells how many of those parts we have. So 3/4 means 3 out of 4 equal parts.

Equivalent fractions: Different fractions can represent the same amount. 1/2 = 2/4 = 4/8. We create equivalent fractions by multiplying or dividing both numerator and denominator by the same number.

Simplifying fractions: 6/8 can be simplified by dividing both numbers by 2 to get 3/4. A fraction is in its simplest form when the numerator and denominator share no common factors other than 1.

Adding and subtracting fractions: Fractions must have the same denominator before we can add or subtract them. 1/3 + 1/4 requires converting to twelfths: 4/12 + 3/12 = 7/12. Mixed numbers (like 2 and 1/2) can be converted to improper fractions (5/2) for calculation.

Multiplying fractions: Multiply numerators together and denominators together. 2/3 × 3/5 = 6/15 = 2/5. No common denominator needed.

Decimal place value: Decimals extend place value to the right of the ones column. In 3.47, the 3 is ones, the 4 is tenths (4/10), and the 7 is hundredths (7/100).

Converting between fractions and decimals: 1/4 = 0.25, 1/2 = 0.5, 3/4 = 0.75. To convert a fraction to a decimal, divide the numerator by the denominator.

Ordering decimals: 0.3, 0.30, and 0.300 are equal. When comparing 0.4 and 0.38, remember 0.4 = 0.40, which is greater than 0.38.`,
  },

  {
    id: "math-4-6-geometry",
    subject: "Mathematics",
    grades: [4, 5, 6],
    title: "Basic Geometry",
    description: "2D shapes, 3D shapes, angles, perimeter and area",
    source: "Aligned with CK-12 Grade 4–6 Geometry (CC-BY-SA) and Cambridge Primary Curriculum",
    content: `Geometry is the study of shapes, sizes, positions, and the properties of space.

2D shapes: A triangle has 3 sides and 3 angles. A quadrilateral has 4 sides — squares and rectangles are special quadrilaterals with right angles. A circle has no straight sides; all points on the circle are the same distance from the centre (the radius).

Angles: An angle is formed when two lines meet at a point. A right angle is exactly 90° — the corner of a square. An acute angle is less than 90°. An obtuse angle is between 90° and 180°. A straight angle is exactly 180°. Angles in a triangle always add up to 180°.

Perimeter: The perimeter is the total distance around the outside of a shape. For a rectangle: perimeter = 2 × length + 2 × width. For any polygon, add the lengths of all sides.

Area: Area is the amount of flat space inside a shape, measured in square units (cm², m²). Area of a rectangle = length × width. Area of a triangle = ½ × base × height.

3D shapes: A cube has 6 square faces, 12 edges, and 8 vertices (corners). A sphere is perfectly round. A cylinder has two circular ends and one curved surface. A cone has a circular base and a point (apex).

Symmetry: A shape has a line of symmetry if you can fold it in half and both halves match perfectly. A square has 4 lines of symmetry; a rectangle has 2.

Coordinates: A coordinate grid uses two number lines (x and y axes) to describe position. The point (3, 4) is 3 units right and 4 units up from the origin (0, 0).`,
  },

  {
    id: "math-4-6-measurement",
    subject: "Mathematics",
    grades: [4, 5, 6],
    title: "Measurement & Time",
    description: "Units of length, mass and volume; converting units; reading time",
    source: "Aligned with CK-12 Grade 4–6 Mathematics (CC-BY-SA) and NCERT Primary Mathematics",
    content: `Measurement connects mathematics to the physical world. We measure length, mass, volume, and time using standard units so that everyone can understand and compare measurements.

Length: The metric system uses millimetres (mm), centimetres (cm), metres (m), and kilometres (km). 10 mm = 1 cm; 100 cm = 1 m; 1,000 m = 1 km. To convert from larger to smaller units, multiply. To convert from smaller to larger units, divide.

Mass: Mass is how much matter is in an object. Units: milligrams (mg), grams (g), and kilograms (kg). 1,000 mg = 1 g; 1,000 g = 1 kg. A small apple weighs about 150 g; a person weighs about 60–70 kg.

Volume and capacity: Volume is the amount of space inside a 3D object. Capacity is how much liquid a container can hold. Units: millilitres (mL) and litres (L). 1,000 mL = 1 L. Volume of a rectangular box = length × width × height.

Temperature: Measured in degrees Celsius (°C). Water freezes at 0°C and boils at 100°C. Normal body temperature is about 37°C.

Time: 60 seconds = 1 minute; 60 minutes = 1 hour; 24 hours = 1 day; 7 days = 1 week; 365 days = 1 year (366 in a leap year). The 24-hour clock avoids confusion between am and pm: 3:00 pm is 15:00.

Elapsed time: To find how long something takes, subtract the start time from the end time. If a journey starts at 09:45 and ends at 12:10, the time taken is 2 hours 25 minutes.

Estimation: Before measuring exactly, estimating builds number sense. A classroom door is about 2 m tall; a textbook weighs about 500 g.`,
  },

  {
    id: "math-7-9-algebra",
    subject: "Mathematics",
    grades: [7, 8, 9],
    title: "Algebra Fundamentals",
    description: "Variables, expressions, linear equations and inequalities",
    source: "Aligned with OpenStax Elementary Algebra 2e (CC-BY) and CK-12 Grade 7–9 Algebra",
    content: `Algebra uses letters (called variables) to represent unknown or changing quantities. It allows us to write general rules that work for any number.

Variables and expressions: A variable is a letter that stands for a number we don't know yet — usually x, y, or n. An algebraic expression combines variables and numbers using operations: 3x + 5 means "three times a number plus five."

Evaluating expressions: To evaluate 3x + 5 when x = 4, substitute 4 for x: 3(4) + 5 = 12 + 5 = 17.

Equations: An equation states that two expressions are equal: 3x + 5 = 17. Solving an equation means finding the value of the variable that makes the equation true.

Solving linear equations: Use inverse operations to isolate the variable. For 3x + 5 = 17: subtract 5 from both sides to get 3x = 12, then divide both sides by 3 to get x = 4. Always perform the same operation on both sides to keep the equation balanced.

Two-step equations: 2x − 3 = 9 → add 3 to both sides: 2x = 12 → divide by 2: x = 6.

Like terms: Terms with the same variable and power can be combined. 3x + 5x = 8x. But 3x + 5y cannot be simplified because x and y are different variables.

Inequalities: An inequality uses <, >, ≤, or ≥ instead of =. Solving 2x + 1 < 9 gives x < 4. When multiplying or dividing an inequality by a negative number, the inequality sign flips.

Substitution and checking: Always substitute your answer back into the original equation to verify it is correct.`,
  },

  {
    id: "math-7-9-ratios",
    subject: "Mathematics",
    grades: [7, 8, 9],
    title: "Ratios & Percentages",
    description: "Ratios, rates, proportions, percentages and percent change",
    source: "Aligned with OpenStax Prealgebra 2e (CC-BY) and CK-12 Grade 7–9 Mathematics",
    content: `A ratio compares two quantities of the same kind. The ratio of 8 boys to 12 girls in a class can be written as 8:12, which simplifies to 2:3.

Rates: A rate compares quantities of different kinds. Speed of 60 km per hour, a price of $3 per litre, or a score of 45 marks per hour are all rates. Unit rate simplifies the rate so the denominator is 1.

Proportions: A proportion states that two ratios are equal: 2/3 = 8/12. To solve a proportion with an unknown, cross-multiply: if 3/5 = x/20, then 3 × 20 = 5 × x, so 60 = 5x, meaning x = 12.

Percentages: A percentage is a ratio with a denominator of 100. 35% means 35 out of every 100. To convert a fraction to a percentage: multiply by 100. To find 20% of 150: 20/100 × 150 = 30.

Percentage increase and decrease: If a price rises from $80 to $100, the increase is $20. Percentage increase = (20/80) × 100 = 25%. If a price falls from $100 to $75, the decrease is $25. Percentage decrease = (25/100) × 100 = 25%.

Discount and profit: A shop selling something at 30% discount means you pay 70% of the original price. Profit percentage = (profit/cost price) × 100.

Scale drawings and maps: A map scale of 1:50,000 means 1 cm on the map represents 50,000 cm (500 m) in real life. Scale drawings are used in architecture, engineering, and geography.

Direct and inverse proportion: In direct proportion, as one quantity increases, the other increases at the same rate (more hours worked → more pay). In inverse proportion, as one increases, the other decreases (more workers → less time to finish a job).`,
  },

  {
    id: "math-7-9-geometry",
    subject: "Mathematics",
    grades: [7, 8, 9],
    title: "Geometry: Area, Volume & Pythagoras",
    description: "Area and volume formulas, Pythagorean theorem, angles in shapes",
    source: "Aligned with CK-12 Grade 7–9 Geometry (CC-BY-SA) and Cambridge Lower Secondary Curriculum",
    content: `Geometry at this level extends from basic shapes to calculating area, volume, and using the Pythagorean theorem.

Area formulas: Rectangle = length × width. Triangle = ½ × base × height. Parallelogram = base × height. Trapezium = ½ × (sum of parallel sides) × height. Circle = π × r² (where r is the radius and π ≈ 3.14159).

Circumference of a circle: C = 2πr or C = πd (where d is the diameter). The diameter is twice the radius.

Volume: Volume measures three-dimensional space in cubic units (cm³, m³). Rectangular prism (cuboid) = length × width × height. Cylinder = π × r² × height. The volume of a triangular prism = area of the triangular cross-section × length.

Surface area: The total area of all faces of a 3D shape. For a cuboid: 2(lw + lh + wh). Surface area determines how much material is needed to cover or wrap something.

The Pythagorean theorem: In any right-angled triangle, the square of the hypotenuse (longest side, c) equals the sum of squares of the other two sides: a² + b² = c². If a = 3 and b = 4, then c² = 9 + 16 = 25, so c = 5. Used to find missing sides in right-angled triangles.

Angle properties: Angles on a straight line sum to 180°. Angles at a point sum to 360°. Vertically opposite angles are equal. Angles in a triangle sum to 180°. Angles in a quadrilateral sum to 360°.

Congruence and similarity: Congruent shapes are exactly the same size and shape. Similar shapes have the same shape but different sizes — corresponding angles are equal and corresponding sides are in proportion.`,
  },

  {
    id: "math-7-9-statistics",
    subject: "Mathematics",
    grades: [7, 8, 9],
    title: "Statistics & Probability",
    description: "Mean, median, mode, data displays, and basic probability",
    source: "Aligned with OpenStax Introductory Statistics (CC-BY) and CK-12 Grade 7–9 Mathematics",
    content: `Statistics is the science of collecting, organising, and interpreting data. Probability measures how likely events are.

Averages (measures of central tendency): The mean is found by adding all values and dividing by the number of values. The median is the middle value when data is arranged in order. The mode is the value that appears most often. Each measure gives a different picture of "typical" data.

Range: The range = highest value − lowest value. It measures how spread out the data is.

Data displays: A frequency table counts how many times each value occurs. A bar chart uses bars to compare categories. A histogram is similar but for continuous data grouped into intervals. A pie chart shows parts of a whole as sectors. A line graph shows change over time. A scatter graph shows the relationship between two variables.

Collecting and sampling: A survey collects data from a sample. For results to be reliable, the sample must be representative of the whole population and large enough. Biased samples give misleading results.

Probability: Probability measures the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain). Probability = number of favourable outcomes ÷ total number of possible outcomes. The probability of rolling a 4 on a fair die = 1/6.

Complementary events: The probability that an event does NOT happen = 1 − probability that it does. If P(rain) = 0.3, then P(no rain) = 0.7.

Experimental vs theoretical probability: Theoretical probability is calculated from known possibilities. Experimental probability is estimated from repeating an experiment many times and recording results. With more trials, experimental probability gets closer to theoretical probability.`,
  },

  {
    id: "math-10-12-equations",
    subject: "Mathematics",
    grades: [10, 11, 12],
    title: "Linear & Quadratic Equations",
    description: "Systems of equations, quadratic formula, factoring, graphing",
    source: "Aligned with OpenStax Algebra & Trigonometry 2e (CC-BY)",
    content: `Linear equations form straight lines when graphed. Quadratic equations form parabolas and are fundamental to higher mathematics, physics, and engineering.

Systems of linear equations: Two or more equations with the same variables. Solved by substitution (express one variable in terms of the other), elimination (add or subtract equations to cancel a variable), or graphically (find where the lines intersect). A system with one solution means the lines intersect at one point; no solution means parallel lines; infinitely many solutions means the same line.

Quadratic equations: A quadratic equation has the form ax² + bx + c = 0. Solutions (roots) are the x-values where the parabola crosses the x-axis.

Factoring: 6x² + 5x − 6 = (2x + 3)(3x − 2). Setting each factor to zero gives the roots. Always check by expanding back.

Completing the square: Rewrite x² + 6x + 5 as (x + 3)² − 4, useful for graphing and deriving the quadratic formula.

The quadratic formula: x = (−b ± √(b² − 4ac)) / 2a. The discriminant b² − 4ac reveals the nature of roots: positive → two real roots, zero → one repeated root, negative → no real roots (complex roots).

Graphing parabolas: y = ax² + bx + c. If a > 0, the parabola opens upward (minimum point). If a < 0, it opens downward (maximum point). The vertex is the turning point, found at x = −b/2a. The axis of symmetry passes through the vertex.

Applications: Projectile motion, optimisation problems (finding maximum area or minimum cost), and revenue/profit models all use quadratic equations.`,
  },

  {
    id: "math-10-12-trigonometry",
    subject: "Mathematics",
    grades: [10, 11, 12],
    title: "Trigonometry",
    description: "Sine, cosine, tangent, unit circle, solving triangles",
    source: "Aligned with OpenStax Algebra & Trigonometry 2e (CC-BY)",
    content: `Trigonometry studies relationships between angles and side lengths in triangles, and extends to waves and periodic functions.

Right-angled triangles: The three primary trigonometric ratios relate to a right-angled triangle where θ is one of the acute angles. SOH-CAH-TOA: Sine θ = Opposite/Hypotenuse; Cosine θ = Adjacent/Hypotenuse; Tangent θ = Opposite/Adjacent.

Exact values: sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3. Sin 45° = cos 45° = 1/√2. Sin 60° = √3/2. These appear in exam problems and should be memorised.

Solving triangles: Given two sides, find an angle using inverse trig (arcsin, arccos, arctan). Given a side and an angle, find the missing side. Use the Pythagorean theorem when you have two sides of a right triangle.

The sine rule: a/sin A = b/sin B = c/sin C. Used for non-right triangles when you know an angle and its opposite side.

The cosine rule: c² = a² + b² − 2ab cos C. Used when you know three sides, or two sides and the included angle.

The unit circle: A circle of radius 1 centred at the origin. For any angle θ, the coordinates of the point on the circle are (cos θ, sin θ). This extends trig functions beyond 0°–90° to all angles, including negative angles and angles greater than 360°.

Graphs of trig functions: y = sin x and y = cos x oscillate between −1 and 1 with a period of 360°. y = tan x has a period of 180° and vertical asymptotes. These functions model waves, sound, and electrical signals.

Applications: Navigation, architecture, engineering, music (sound waves), and physics all rely on trigonometry.`,
  },

  {
    id: "math-10-12-statistics",
    subject: "Mathematics",
    grades: [10, 11, 12],
    title: "Data Analysis & Statistics",
    description: "Normal distribution, correlation, regression, statistical inference",
    source: "Aligned with OpenStax Introductory Statistics (CC-BY)",
    content: `Advanced statistics provides tools for analysing real-world data and drawing reliable conclusions.

Measures of spread: Variance measures how far data values are from the mean on average (squared). Standard deviation is the square root of variance — expressed in the same units as the data. A small standard deviation means data is clustered near the mean; a large one means data is spread out.

Normal distribution: Many natural phenomena (heights, exam scores, measurement errors) follow a bell-shaped normal distribution. About 68% of data falls within one standard deviation of the mean, 95% within two, and 99.7% within three (the empirical rule).

Correlation: Describes the relationship between two variables. A positive correlation means as one increases, the other tends to increase. A negative correlation means as one increases, the other tends to decrease. The correlation coefficient r ranges from −1 (perfect negative) to +1 (perfect positive). r = 0 means no linear relationship.

Scatter plots and line of best fit: Plot one variable on the x-axis and one on the y-axis. Draw the line of best fit (regression line) to summarise the trend. Use it to make predictions.

Regression: The equation of the regression line is ŷ = a + bx. The gradient b tells us how much y changes for each unit increase in x.

Sampling and inference: A sample is used to draw conclusions about a population. A larger, randomly selected sample gives more reliable results. A confidence interval gives a range of values that likely contains the true population mean.

Hypothesis testing: We start with a null hypothesis (e.g., "the new teaching method makes no difference") and test whether the data provides enough evidence to reject it. A p-value less than 0.05 is typically considered statistically significant.`,
  },

  {
    id: "math-10-12-financial",
    subject: "Mathematics",
    grades: [10, 11, 12],
    title: "Financial Mathematics",
    description: "Simple and compound interest, loans, budgeting, investment",
    source: "Aligned with OpenStax Prealgebra 2e (CC-BY) and Cambridge IGCSE Mathematics",
    content: `Financial mathematics equips students with the skills to manage money responsibly — a life skill of enormous practical value.

Simple interest: Interest earned only on the principal (original amount). Formula: I = PRT where P = principal, R = annual interest rate (as a decimal), T = time in years. Total amount = P + I.

Compound interest: Interest is earned on both the principal and the accumulated interest. Formula: A = P(1 + r/n)^(nt) where n = number of times interest is compounded per year. Compound interest grows faster than simple interest — this is the power of saving early.

Loans and repayments: When borrowing money, you pay back the principal plus interest. A longer loan period means smaller monthly payments but more total interest paid. A higher interest rate means more expensive borrowing.

Depreciation: Assets like cars and equipment lose value over time. Straight-line depreciation reduces value by the same amount each year. Compound depreciation (reducing balance) reduces value by the same percentage each year.

Budgeting: A budget plans income and expenditure. Income − expenses = savings (or deficit). Good budgeting means spending less than you earn and planning for unexpected costs.

Exchange rates: The exchange rate tells you how much of one currency equals another. If R15 = $1, then to convert rand to dollars, divide by 15; to convert dollars to rand, multiply by 15.

Inflation: The general rise in prices over time. If inflation is 5% per year, something costing R100 today will cost R105 in a year. Real interest rate = nominal rate − inflation rate.

Tax: VAT (value-added tax) is added to most goods and services. Income tax is calculated on earnings above a tax-free threshold, at rates that increase with income (progressive tax).`,
  },

  // ══════════════════════════════════════════════════════
  // SCIENCE
  // ══════════════════════════════════════════════════════

  {
    id: "science-1-3-living-things",
    subject: "Science",
    grades: [1, 2, 3],
    title: "Living Things & Habitats",
    description: "Characteristics of living things, animals, plants and their habitats",
    source: "Aligned with CK-12 Grade 1–3 Life Science (CC-BY-SA) and UNESCO IBE Primary Science",
    content: `All living things — plants, animals, fungi, and tiny microorganisms — share seven key characteristics that set them apart from non-living things.

The seven characteristics of living things (MRS NERG): Movement (even plants move toward light), Respiration (releasing energy from food), Sensitivity (detecting and responding to changes), Nutrition (taking in and using food or making their own), Excretion (removing waste), Reproduction (making more of their kind), and Growth (increasing in size).

Animals: Animals must eat other living things for food. They can be herbivores (eat only plants), carnivores (eat only animals), or omnivores (eat both). Animals sense their environment and move around to find food, shelter, and mates.

Plants: Plants make their own food using sunlight, water, and carbon dioxide in a process called photosynthesis. They need water, light, warmth, and nutrients from the soil to grow.

Habitats: A habitat is the natural home of a plant or animal — the place where it finds everything it needs to survive. Habitats include forests, deserts, oceans, rivers, grasslands, and even cities.

Adaptation: Living things are adapted to their habitat. A polar bear has thick fur and a layer of fat to survive freezing temperatures. A cactus stores water in its thick stem to survive in a desert. A duck has webbed feet for swimming.

Food chains: A simple food chain shows what eats what in a habitat. Grass → grasshopper → frog → snake → eagle. The sun provides energy to plants at the start of every food chain.

Caring for habitats: Human activities like cutting down forests, polluting rivers, and building on wild land can destroy habitats and threaten the survival of living things.`,
  },

  {
    id: "science-1-3-matter",
    subject: "Science",
    grades: [1, 2, 3],
    title: "Matter & Materials",
    description: "Solids, liquids and gases; properties of materials; simple changes",
    source: "Aligned with CK-12 Grade 1–3 Physical Science (CC-BY-SA) and NCERT Primary Science",
    content: `Everything around us is made of matter. Matter is anything that takes up space and has mass (weight). Matter exists in three main states: solid, liquid, and gas.

Solids: A solid has a definite shape and volume. The particles in a solid are packed tightly together and vibrate in place. Examples: wood, rock, ice, metal. Solids keep their shape unless a force changes them.

Liquids: A liquid has a definite volume but no fixed shape — it takes the shape of whatever container it is in. The particles in a liquid are close together but can flow past each other. Examples: water, juice, mercury.

Gases: A gas has no fixed shape or volume — it spreads out to fill its container. Gas particles move quickly and are far apart. Examples: air, steam, oxygen. Gases are usually invisible.

Properties of materials: We choose materials based on their properties. Metal conducts electricity and heat. Wood is strong and easy to shape. Plastic is light and waterproof. Cotton is soft and absorbs water. Glass is transparent (you can see through it).

Changing materials: Some changes are reversible — melting ice makes water, which can be frozen again. Boiling water makes steam, which becomes water when cooled (condensation). Some changes are irreversible — burning paper, cooking an egg, or mixing cement cannot be undone.

Heating and cooling: Most solids melt when heated enough. Most liquids boil and become gas when heated further. Cooling reverses these changes. Water melts at 0°C and boils at 100°C.

Everyday materials: A scientist tests materials to find the best one for a job. A bridge needs strong material. A raincoat needs waterproof material. A window needs transparent material.`,
  },

  {
    id: "science-1-3-weather",
    subject: "Science",
    grades: [1, 2, 3],
    title: "Weather & Seasons",
    description: "Types of weather, seasons, the water cycle, and weather measurement",
    source: "Aligned with CK-12 Grade 1–3 Earth Science (CC-BY-SA) and UNESCO IBE Primary Science",
    content: `Weather describes what is happening in the atmosphere — the layer of air around the Earth — at a particular place and time. Climate is the typical weather a place experiences over many years.

Types of weather: Sunny weather happens when clouds are few and sunlight reaches the ground directly. Cloudy weather occurs when water droplets form clouds. Rainy weather happens when water droplets in clouds combine and fall as rain. Windy weather is caused by differences in air pressure. Snowy weather occurs when temperatures are freezing.

The water cycle: Water moves continuously between the Earth's surface and the atmosphere. The sun heats water in oceans, lakes, and rivers, causing it to evaporate (turn to water vapour). The vapour rises, cools, and condenses into clouds. When enough water collects, it falls as precipitation (rain, snow, hail). Water flows into rivers and soaks into the ground, eventually returning to the sea.

Seasons: Many places have four seasons — spring, summer, autumn, and winter. Seasons are caused by Earth's tilt as it orbits the sun. When the northern hemisphere tilts toward the sun, it experiences summer (more sunlight, warmer). When it tilts away, it experiences winter. Some regions near the equator have wet and dry seasons instead.

Measuring weather: A thermometer measures temperature in degrees Celsius (°C). A rain gauge measures rainfall in millimetres (mm). A wind vane shows the direction of the wind. An anemometer measures wind speed.

Weather and living things: Plants and animals respond to weather and seasons. Some animals hibernate (sleep through winter). Birds migrate to warmer places. Trees lose their leaves in autumn. Farmers plant and harvest according to the seasons.`,
  },

  {
    id: "science-4-6-plants",
    subject: "Science",
    grades: [4, 5, 6],
    title: "Plants & Photosynthesis",
    description: "Plant structure, photosynthesis, pollination and reproduction",
    source: "Aligned with CK-12 Grade 4–6 Life Science (CC-BY-SA) and OpenStax Concepts of Biology",
    content: `Plants are the foundation of almost all life on Earth because they produce food from sunlight — a process no animal can do.

Plant structure: Roots anchor the plant and absorb water and minerals from the soil. The stem supports the plant and transports water and nutrients. Leaves are the main site of photosynthesis. Flowers produce seeds for reproduction. Fruit protects seeds and helps disperse them.

Photosynthesis: This is the process by which plants make food. Equation: Carbon dioxide + Water → (using sunlight and chlorophyll) → Glucose + Oxygen. Chlorophyll is the green pigment in leaves that captures light energy. The glucose produced is used for energy and growth. The oxygen released is what animals (including humans) breathe.

What plants need: Light (for photosynthesis), water (absorbed by roots), carbon dioxide (from the air through tiny pores called stomata), and mineral salts (from the soil, especially nitrogen for growth).

Transpiration: Plants release water vapour through their stomata — this is transpiration. It creates a flow of water upward through the plant (the transpiration stream) and helps cool the plant on hot days.

Pollination: Flowers contain male parts (stamens, which produce pollen) and female parts (pistils, which contain ovules). Pollination is the transfer of pollen from a stamen to a pistil. Wind and insects (especially bees) are the main pollinators.

Seed dispersal: After fertilisation, seeds must be spread away from the parent plant to reduce competition. Seeds are dispersed by wind (dandelion), animals (burr hooks, fruit eaten and seeds excreted), water (coconut), or explosion (peas popping open).

Germination: A seed germinates (begins growing) when it has enough water, warmth, and oxygen. The seedling uses food stored in the seed until its leaves can photosynthesise.`,
  },

  {
    id: "science-4-6-ecosystems",
    subject: "Science",
    grades: [4, 5, 6],
    title: "Food Chains & Ecosystems",
    description: "Food chains, food webs, energy flow, and human impact on ecosystems",
    source: "Aligned with CK-12 Grade 4–6 Life Science (CC-BY-SA) and UNESCO IBE Curriculum",
    content: `An ecosystem is a community of living things (plants, animals, microorganisms) interacting with each other and with their non-living environment (soil, water, air, sunlight).

Producers: Plants and algae are producers because they make their own food using photosynthesis. All energy in an ecosystem ultimately comes from the sun via producers.

Consumers: Animals are consumers because they must eat other organisms to get energy. Primary consumers (herbivores) eat producers. Secondary consumers eat primary consumers. Tertiary consumers are at the top of the food chain.

Food chains: Show the flow of energy from one organism to the next. Example: Grass → zebra → lion. The arrow means "is eaten by" or "energy flows to."

Food webs: Real ecosystems are more complex — most animals eat more than one type of food and are eaten by more than one predator. A food web shows all the feeding relationships in an ecosystem.

Decomposers: Bacteria and fungi break down dead organisms and waste, returning nutrients to the soil. Without decomposers, nutrients would be locked in dead material and ecosystems would collapse.

Energy pyramids: Each time energy moves up a food chain, about 90% is lost as heat. This is why there are always fewer animals at higher levels — a vast amount of plant material is needed to support a small number of top predators.

Biodiversity: The variety of living things in an ecosystem makes it more resilient. If one species disappears, others can fill its role.

Human impact: Deforestation, pollution, hunting, and climate change reduce biodiversity and disrupt ecosystems. Conservation means protecting species and habitats. Sustainable practices use natural resources without depleting them for future generations.`,
  },

  {
    id: "science-4-6-earth-space",
    subject: "Science",
    grades: [4, 5, 6],
    title: "Earth & Space",
    description: "The solar system, Earth's structure, rock cycle, and day/night",
    source: "Aligned with CK-12 Grade 4–6 Earth Science (CC-BY-SA) and NCERT Science Grade 5–6",
    content: `Earth is one of eight planets orbiting the Sun in our solar system. Understanding Earth's structure and its place in space helps us understand earthquakes, volcanoes, seasons, and the origin of rocks.

The solar system: The Sun is a star at the centre. The eight planets orbit the Sun in order: Mercury, Venus, Earth, Mars (inner rocky planets), Jupiter, Saturn, Uranus, Neptune (outer gas giants). Earth is the third planet from the Sun and the only one known to support life. The Moon orbits Earth and reflects sunlight.

Day and night: Earth rotates on its axis once every 24 hours. When your side of Earth faces the Sun, it is day. When it faces away, it is night. The Sun rises in the east and sets in the west because Earth rotates from west to east.

Seasons: Earth orbits the Sun once every 365.25 days. Earth is tilted at 23.5°. When a hemisphere tilts toward the Sun, it receives more direct sunlight and experiences summer. When it tilts away, it receives less sunlight and experiences winter.

Earth's layers: The crust is the thin outer layer we live on. The mantle is a thick layer of semi-molten rock. The outer core is liquid iron and nickel. The inner core is solid iron and nickel at extreme pressure. Convection currents in the mantle drive plate tectonics.

Plate tectonics: Earth's crust is broken into large pieces called tectonic plates that move very slowly. Where plates meet, we get earthquakes, volcanoes, and mountain building.

The rock cycle: Rocks are constantly being created, destroyed, and transformed. Igneous rocks form from cooled magma (granite, basalt). Sedimentary rocks form from compressed sediments (sandstone, limestone). Metamorphic rocks are changed by heat and pressure (marble, slate).`,
  },

  {
    id: "science-7-9-cells",
    subject: "Science",
    grades: [7, 8, 9],
    title: "Cells & the Human Body",
    description: "Cell structure, organ systems, and how the human body works",
    source: "Aligned with OpenStax Concepts of Biology (CC-BY) and CK-12 Grade 7–9 Life Science",
    content: `All living organisms are made of cells — the smallest unit of life. The human body contains about 37 trillion cells.

Cell structure: Animal cells have a cell membrane (controls what enters and exits), cytoplasm (jelly-like fluid), nucleus (contains DNA and controls the cell), mitochondria (produce energy through respiration), and ribosomes (make proteins). Plant cells additionally have a cell wall (rigid, made of cellulose), a large vacuole (stores water), and chloroplasts (for photosynthesis).

Specialised cells: Cells are adapted to their function. Red blood cells have no nucleus — maximising space for haemoglobin to carry oxygen. Nerve cells are long and thin to transmit electrical signals quickly. Muscle cells contain many mitochondria for energy.

Tissues, organs and systems: Similar cells group into tissues. Tissues group into organs (the heart, brain, lungs). Organs work together in organ systems (the circulatory, nervous, digestive systems).

Circulatory system: The heart pumps blood around the body. Arteries carry oxygenated blood away from the heart. Veins return deoxygenated blood to the heart. Capillaries exchange oxygen and nutrients with cells.

Digestive system: Food travels from the mouth → oesophagus → stomach → small intestine (where nutrients are absorbed into the blood) → large intestine (where water is absorbed) → rectum → anus.

Respiratory system: When we breathe in, air travels to the lungs where oxygen diffuses into the blood and carbon dioxide diffuses out. The diaphragm and intercostal muscles power breathing.

Nervous system: The brain and spinal cord form the central nervous system. Sensory neurons carry signals to the brain; motor neurons carry signals from the brain to muscles. A reflex arc allows fast responses without conscious thought.`,
  },

  {
    id: "science-7-9-forces",
    subject: "Science",
    grades: [7, 8, 9],
    title: "Forces & Motion",
    description: "Newton's laws, gravity, friction, speed and acceleration",
    source: "Aligned with CK-12 Grade 7–9 Physics (CC-BY-SA) and Cambridge Lower Secondary Science",
    content: `A force is a push or pull that can change an object's speed, direction, or shape. Forces are measured in Newtons (N).

Types of forces: Gravity pulls objects toward Earth's centre. Friction opposes motion between surfaces in contact. Air resistance (drag) opposes motion through air. Normal force pushes back when surfaces touch. Tension pulls through ropes or strings. Magnetic force attracts or repels magnetic materials.

Newton's First Law (inertia): An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced force. A ball rolling on a table slows down because of friction — without friction, it would roll forever.

Newton's Second Law: Force = mass × acceleration (F = ma). A larger force causes greater acceleration. A heavier object requires more force to accelerate at the same rate. Units: force in Newtons, mass in kilograms, acceleration in m/s².

Newton's Third Law: For every action, there is an equal and opposite reaction. When you push against a wall, the wall pushes back on you with equal force. Rocket engines work on this principle — gas is expelled backward, pushing the rocket forward.

Speed and velocity: Speed = distance ÷ time (m/s). Velocity is speed in a specific direction — a vector quantity. Acceleration = change in velocity ÷ time. Deceleration is negative acceleration.

Gravity: On Earth, the gravitational field strength is approximately 9.8 N/kg. Weight = mass × gravitational field strength. A 10 kg object weighs approximately 98 N on Earth.

Distance-time and velocity-time graphs: A straight line on a distance-time graph means constant speed. A curved line means changing speed. On a velocity-time graph, the gradient equals acceleration, and the area under the curve equals distance travelled.`,
  },

  {
    id: "science-7-9-energy",
    subject: "Science",
    grades: [7, 8, 9],
    title: "Energy & Electricity",
    description: "Forms of energy, energy transfer, circuits and electricity",
    source: "Aligned with CK-12 Grade 7–9 Physics (CC-BY-SA) and Cambridge Lower Secondary Science",
    content: `Energy is the ability to do work. It cannot be created or destroyed — only transferred or converted from one form to another (conservation of energy).

Forms of energy: Kinetic (movement), potential (stored — gravitational, elastic, chemical), thermal (heat), light, sound, electrical, and nuclear. A ball falling from a height converts gravitational potential energy to kinetic energy.

Energy transfers: A toaster converts electrical energy to thermal and light energy. A solar panel converts light to electrical energy. Every transfer wastes some energy as heat — this is why efficiency is always less than 100%.

Heat transfer: Conduction — heat passes through solids by particle-to-particle vibration (metal conducts well, wood does not). Convection — heat moves through liquids and gases as warm fluid rises and cool fluid sinks. Radiation — heat travels as infrared waves without needing matter (the sun warms Earth through space).

Electric current: Electrical current is the flow of charged particles (electrons) through a conductor. Measured in amperes (A). Voltage (V) is the "push" driving the current. Resistance (Ω) opposes the flow. Ohm's Law: V = IR.

Series and parallel circuits: In a series circuit, components are connected in a single loop — if one fails, all fail. In a parallel circuit, components have separate paths — if one fails, others continue working. Household electrical wiring uses parallel circuits.

Renewable and non-renewable energy: Fossil fuels (coal, oil, gas) release carbon dioxide when burned, contributing to climate change, and will eventually run out. Renewable sources — solar, wind, hydroelectric, geothermal — are sustainable and produce little or no carbon emissions.`,
  },

  {
    id: "science-7-9-chemistry",
    subject: "Science",
    grades: [7, 8, 9],
    title: "Chemical Changes",
    description: "Elements, compounds, mixtures, chemical reactions and equations",
    source: "Aligned with CK-12 Grade 7–9 Chemistry (CC-BY-SA) and Cambridge Lower Secondary Science",
    content: `Chemistry studies the composition, structure, and transformation of matter at the atomic and molecular level.

Elements: A pure substance made of one type of atom. There are 118 known elements, listed in the periodic table. Examples: oxygen (O), carbon (C), gold (Au), iron (Fe), hydrogen (H).

Compounds: Two or more elements chemically bonded together. Water (H₂O) is two hydrogen atoms bonded to one oxygen atom. Carbon dioxide (CO₂) is one carbon bonded to two oxygens. Compounds have different properties from their constituent elements.

Mixtures: Two or more substances combined but not chemically bonded — they can be separated by physical methods. Salt water is a mixture of salt and water. Air is a mixture of nitrogen, oxygen, and other gases.

Separating mixtures: Filtration removes insoluble solids from liquids. Evaporation removes liquid from a dissolved solid. Distillation separates liquids with different boiling points. Chromatography separates pigments based on how far they travel in a solvent.

Chemical reactions: In a chemical reaction, starting materials (reactants) are transformed into new substances (products). Signs of a chemical reaction: temperature change, colour change, gas produced, precipitate formed, smell, light produced.

Word equations: Reactants → products. For example: magnesium + oxygen → magnesium oxide.

Symbol equations: 2Mg + O₂ → 2MgO. The equation must be balanced — the number of each atom must be equal on both sides (conservation of mass).

Acids and alkalis: Acids have a pH below 7 (lemon juice, vinegar, hydrochloric acid). Alkalis have a pH above 7 (bicarbonate of soda, ammonia, bleach). Neutral substances have pH 7. Acids and alkalis react together in a neutralisation reaction to form a salt and water.`,
  },

  {
    id: "science-10-12-genetics",
    subject: "Science",
    grades: [10, 11, 12],
    title: "Genetics & Evolution",
    description: "DNA, inheritance, natural selection and evidence for evolution",
    source: "Aligned with OpenStax Biology 2e (CC-BY)",
    content: `Genetics is the study of heredity — how traits are passed from parents to offspring. Evolution explains how species change over time through natural selection.

DNA: Deoxyribonucleic acid (DNA) is a double helix molecule found in the nucleus of cells. It contains the genetic instructions for building and operating an organism. DNA is made of four bases: adenine (A), thymine (T), cytosine (C), and guanine (G). A always pairs with T; C always pairs with G.

Genes and chromosomes: A gene is a segment of DNA that codes for a specific protein. Humans have approximately 20,000–25,000 genes. Genes are carried on chromosomes. Humans have 46 chromosomes (23 pairs). One chromosome of each pair comes from each parent.

Dominant and recessive alleles: Alleles are different versions of the same gene. A dominant allele (B) is expressed whenever present. A recessive allele (b) is only expressed when two copies are present (bb). A Punnett square predicts the probability of offspring having certain traits.

Protein synthesis: DNA → mRNA (transcription) → protein (translation). The sequence of bases in a gene codes for a sequence of amino acids, which fold into a specific protein. Mutations (changes in DNA) can alter protein function.

Natural selection: Charles Darwin proposed that organisms with traits better suited to their environment survive and reproduce more successfully, passing those traits to offspring. Over many generations, this "survival of the fittest" causes populations to change.

Evidence for evolution: Fossil record (older fossils show ancestral forms), comparative anatomy (similar bone structures in different species — homologous structures), DNA similarity (humans share ~98% of DNA with chimpanzees), observed evolution (antibiotic resistance in bacteria).

Genetic modification: Scientists can now edit DNA using tools like CRISPR. This has applications in medicine (treating genetic diseases), agriculture (pest-resistant crops), and research.`,
  },

  {
    id: "science-10-12-chemistry",
    subject: "Science",
    grades: [10, 11, 12],
    title: "Atomic Theory & Chemical Reactions",
    description: "Atomic structure, periodic table, bonding and stoichiometry",
    source: "Aligned with OpenStax Chemistry 2e (CC-BY)",
    content: `Modern chemistry rests on understanding the structure of atoms and how they combine in chemical reactions.

Atomic structure: An atom has a central nucleus containing protons (positive charge) and neutrons (no charge), surrounded by electrons (negative charge) in shells. Atomic number = number of protons. Mass number = protons + neutrons. Isotopes are atoms of the same element with different numbers of neutrons.

The periodic table: Elements are arranged in order of increasing atomic number. Elements in the same group (vertical column) have similar chemical properties because they have the same number of outer electrons. Periods (horizontal rows) show the filling of electron shells.

Chemical bonding: Ionic bonding — electrons are transferred from a metal to a non-metal, creating oppositely charged ions that attract. Example: NaCl (table salt). Covalent bonding — non-metal atoms share electrons. Example: H₂O, CO₂. Metallic bonding — positive metal ions in a "sea" of delocalised electrons.

Moles and stoichiometry: The mole is the SI unit for amount of substance (6.022 × 10²³ particles — Avogadro's number). Molar mass (g/mol) is numerically equal to relative atomic mass. Balanced equations tell us the mole ratios of reactants and products.

Rates of reaction: Reactions go faster when concentration increases, temperature increases, surface area increases, or a catalyst is added. Collision theory explains why — more collisions with sufficient energy lead to more reactions.

Equilibrium: Reversible reactions reach dynamic equilibrium when the forward and reverse rates are equal. Le Chatelier's principle: if conditions change, the equilibrium shifts to oppose the change.

Organic chemistry: Carbon forms the basis of life and of an enormous range of synthetic materials. Hydrocarbons (alkanes, alkenes) come from crude oil. Polymers (plastics) are long-chain molecules made from small repeating units (monomers).`,
  },

  {
    id: "science-10-12-physics",
    subject: "Science",
    grades: [10, 11, 12],
    title: "Physics: Mechanics, Waves & Electricity",
    description: "Motion, forces, wave properties, electromagnetism",
    source: "Aligned with OpenStax University Physics Vol. 1 (CC-BY) and Cambridge IGCSE Physics",
    content: `Physics seeks to understand the fundamental laws governing matter, energy, space, and time.

Kinematics: Equations of motion (SUVAT): v = u + at; s = ut + ½at²; v² = u² + 2as; s = (u+v)/2 × t. Where s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time. These apply when acceleration is constant.

Newton's laws: F = ma (Second Law) is the cornerstone of classical mechanics. Momentum = mass × velocity. Conservation of momentum: total momentum before a collision = total momentum after.

Work, energy, power: Work = force × displacement in direction of force (Joules). Kinetic energy = ½mv². Gravitational potential energy = mgh. Power = work done / time (Watts). Efficiency = useful output energy / total input energy × 100%.

Waves: Transverse waves (light, water waves) oscillate perpendicular to the direction of travel. Longitudinal waves (sound) oscillate parallel to the direction of travel. Wave equation: speed = frequency × wavelength (v = fλ). Properties: reflection, refraction, diffraction, and interference.

The electromagnetic spectrum: Ordered by frequency (and energy): radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays. All travel at 3 × 10⁸ m/s in a vacuum.

Electric fields and circuits: Electric field strength = force / charge. In circuits: power P = IV = I²R = V²/R. Kirchhoff's laws: sum of currents at a junction = 0; sum of voltages around a loop = 0.

Electromagnetism: A current-carrying conductor in a magnetic field experiences a force (motor effect). A changing magnetic field induces an EMF (electromagnetic induction — generator effect). Transformers step voltage up or down: V₁/V₂ = N₁/N₂.`,
  },

  // ══════════════════════════════════════════════════════
  // ENGLISH / LANGUAGE ARTS
  // ══════════════════════════════════════════════════════

  {
    id: "english-1-3-phonics",
    subject: "English",
    grades: [1, 2, 3],
    title: "Phonics & Early Reading",
    description: "Letter sounds, blending, sight words and reading fluency",
    source: "Aligned with CK-12 Grade 1–3 English Language Arts (CC-BY-SA) and UNESCO Literacy Framework",
    content: `Phonics teaches children to connect letters (graphemes) with their sounds (phonemes) — the fundamental skill for reading and writing in alphabetic languages.

The alphabet: English has 26 letters but 44 phonemes (sounds). Each letter or combination of letters represents one or more sounds. Learning the alphabet means learning both letter names and the sounds they typically make.

Phonemic awareness: Before reading, children learn to hear and manipulate sounds in spoken words. Rhyming (cat, bat, hat), segmenting (c-a-t are three sounds), and blending (put c, a, t together to say "cat") are key phonemic skills.

Letter-sound correspondences: Each letter has a primary sound: b says /b/, c says /k/ or /s/, a says /æ/ (as in "apple"). Consonant blends combine two consonants: bl, cr, st, tr. Digraphs are two letters making one sound: ch, sh, th, wh, ph.

Vowels: The five vowels (a, e, i, o, u) can make short sounds (apple, egg, insect, orange, umbrella) or long sounds that say their name (cake, Pete, kite, home, cube). The "silent e" rule: an e at the end of a word often makes the previous vowel long (hop → hope).

Decoding: Sounding out an unfamiliar word by working through it letter by letter or chunk by chunk is called decoding. With practice, children recognise common patterns and can decode new words quickly.

Sight words: Some common words don't follow regular phonics rules and must be memorised by sight: the, said, was, have, come, they, are. These appear so often that knowing them by sight speeds up reading considerably.

Reading fluency: Fluent readers read smoothly and accurately, at an appropriate speed, with expression. Fluency develops with practice — reading aloud daily, rereading favourite books, and listening to fluent readers are all effective strategies.`,
  },

  {
    id: "english-1-3-grammar",
    subject: "English",
    grades: [1, 2, 3],
    title: "Basic Grammar",
    description: "Nouns, verbs, adjectives, sentences and punctuation",
    source: "Aligned with CK-12 Grade 1–3 English Language Arts (CC-BY-SA) and NCERT English Primary",
    content: `Grammar is the set of rules that organises language so that speakers and writers can communicate clearly and be understood.

Nouns: A noun is a naming word — it names a person, place, thing, or idea. Common nouns name general things (dog, city, book). Proper nouns name specific people, places, or things and always begin with a capital letter (Tom, London, Monday). A plural noun names more than one thing — usually add s or es (cat → cats, box → boxes).

Pronouns: Pronouns replace nouns to avoid repetition. "The teacher called. She said class was cancelled." Personal pronouns: I, you, he, she, it, we, they; me, him, her, us, them.

Verbs: A verb expresses an action or state of being. Action verbs: run, eat, think, laugh. Being verbs: is, are, was, were, am. Every sentence needs a verb. Tense tells us when the action happens: present (I run), past (I ran), future (I will run).

Adjectives: An adjective describes a noun. "The big, red ball." Adjectives can compare: small, smaller, smallest (comparative and superlative forms).

Adverbs: An adverb modifies a verb, adjective, or another adverb. "She ran quickly. He was very tired." Many adverbs end in -ly.

Sentences: A sentence must have a subject (who or what) and a predicate (what they do or are). "The dog barked." A statement ends with a full stop. A question ends with a question mark. An exclamation ends with an exclamation mark.

Punctuation: Capital letters start sentences and proper nouns. Full stops end statements. Commas separate items in a list or clauses. Apostrophes show possession (the cat's tail) or a missing letter in a contraction (don't = do not).`,
  },

  {
    id: "english-1-3-storytelling",
    subject: "English",
    grades: [1, 2, 3],
    title: "Storytelling & Creative Expression",
    description: "Story structure, characters, setting, oral and written storytelling",
    source: "Aligned with CK-12 Grade 1–3 English Language Arts (CC-BY-SA) and Global Digital Library (UNESCO endorsed)",
    content: `Stories are how humans share experiences, ideas, emotions, and knowledge. Learning to tell stories — spoken and written — develops imagination, language, and empathy.

Story structure: Most stories follow a pattern. The beginning introduces the characters, the setting (where and when), and a problem. The middle shows the characters trying to solve the problem — usually with obstacles and difficulties. The end shows how the problem is resolved and what the characters have learned.

Characters: Characters are the people, animals, or creatures in a story. The main character (protagonist) faces the central problem. A good character feels real — they have feelings, wants, fears, and quirks. We understand characters through what they do, say, and think.

Setting: The setting is where and when the story takes place. A vivid setting makes the story come alive. Describing sights, sounds, smells, and feelings helps the reader or listener feel present.

The problem and solution: Every story needs a problem (sometimes called conflict) to make it interesting. Without a problem, nothing much happens. The satisfaction of a story comes from seeing the problem resolved — or sometimes not resolved, which is equally powerful.

Oral storytelling: Before writing, all human cultures passed stories through speech. Good oral storytellers use voice — changing pace, volume, and tone. They pause for effect. They look at their audience and use gestures. Listening to and retelling stories aloud develops vocabulary and confidence.

Written storytelling: When writing a story, plan first: who, where, what problem, how is it solved? Use interesting words, not just "said" — try whispered, shouted, laughed. Show feelings through actions, not just by saying "she was sad" — show the tears, the silence.

Reading widely: Reading many types of stories — traditional tales, adventure, fantasy, realistic fiction — builds vocabulary, imagination, and understanding of how stories work.`,
  },

  {
    id: "english-4-6-comprehension",
    subject: "English",
    grades: [4, 5, 6],
    title: "Reading Comprehension",
    description: "Literal and inferential comprehension, main idea, summarising",
    source: "Aligned with CK-12 Grade 4–6 English Language Arts (CC-BY-SA) and UNESCO Reading Literacy Framework",
    content: `Reading comprehension means understanding what you read — not just decoding the words, but grasping the meaning, making inferences, and thinking critically about the text.

Literal comprehension: Answering questions directly from information stated in the text. "Where did the story take place?" or "What year did the event occur?" The answer is explicitly stated.

Inferential comprehension: Answering questions by reading between the lines — combining what the text says with what you already know. "Why do you think the character felt nervous?" The text might not say "nervous" but gives clues through behaviour or dialogue.

Main idea: The main idea is the most important point the author is making. In a paragraph, the main idea is often stated in the first or last sentence (the topic sentence). Supporting details give evidence, examples, or explanation for the main idea.

Summarising: A good summary is much shorter than the original text and includes only the main ideas, not details. Writing a summary in your own words shows true understanding. A common mistake is quoting too much instead of paraphrasing.

Vocabulary in context: When you meet an unfamiliar word, use context clues — the surrounding sentences — to work out its meaning. Word parts also help: the prefix "un-" means not (unhappy), the suffix "-tion" forms nouns (pollution).

Text types: Different types of texts have different purposes and structures. A narrative tells a story. An explanation text explains how something works. A persuasive text argues a point of view. A report gives factual information. Recognising the text type helps comprehension.

Active reading strategies: Preview (look at headings, pictures, and the first/last paragraphs before reading). Ask questions while reading. Visualise what is described. Connect the text to what you already know. Review after reading by summarising in your head.`,
  },

  {
    id: "english-4-6-writing",
    subject: "English",
    grades: [4, 5, 6],
    title: "Creative Writing",
    description: "Planning and structuring stories, descriptive language, paragraphing",
    source: "Aligned with CK-12 Grade 4–6 English Language Arts (CC-BY-SA) and Cambridge Primary English",
    content: `Creative writing lets you build worlds, explore emotions, and share ideas through the power of language. Good writing is crafted — it is planned, drafted, revised, and polished.

Planning: Before writing, decide on your purpose (to entertain, describe, persuade?) and audience (a child? a teacher? a newspaper reader?). For stories: plan your character, setting, problem, and resolution. A quick mind-map or story mountain helps organise ideas.

Show, don't tell: Instead of writing "The room was messy," show it: "Clothes covered every surface. An overflowing bin sat by the door. Yesterday's dishes balanced on the windowsill." Instead of "She was excited," show it: "Her heart hammered. She bounced on her toes and checked the clock for the hundredth time."

Descriptive language: Adjectives add detail to nouns. Adverbs modify verbs. Similes compare using "like" or "as": "Her laughter was like bells." Metaphors say something IS something else: "The classroom was a battlefield." Personification gives human qualities to non-human things: "The wind moaned."

Paragraphing: A new paragraph begins a new idea, time, place, or speaker. In a story: new scene, new time, new speaker, new action. In non-fiction: each paragraph addresses one main idea. Leave a line between paragraphs or indent the first line.

Sentence variety: Vary sentence length for effect. Short sentences create tension or emphasis. "She stopped. Listened. Nothing." Longer sentences flow and describe. Too many of the same length becomes monotonous.

Dialogue: Direct speech uses quotation marks. "I don't want to go," said James. A new line and new quotation marks begin each new speaker's words. Dialogue reveals character and advances plot.

Revising and editing: First drafts are rarely perfect. Revising means improving content and structure. Editing means checking spelling, punctuation, and grammar. Reading aloud helps you hear how your writing sounds.`,
  },

  {
    id: "english-4-6-vocabulary",
    subject: "English",
    grades: [4, 5, 6],
    title: "Vocabulary & Spelling",
    description: "Building word knowledge, spelling strategies, prefixes, suffixes and context clues",
    source: "Aligned with CK-12 Grade 4–6 English Language Arts (CC-BY-SA) and UNESCO IBE Curriculum Framework for Language Literacy",
    content: `A rich vocabulary allows students to read more challenging texts, express ideas precisely, and communicate with confidence. Vocabulary and spelling grow together — understanding a word's meaning and knowing how to spell it reinforce each other.

Word families: Many words share a root with the same meaning. The root "port" (carry) appears in transport, portable, import, export, and report. Learning roots helps students decode unfamiliar words. Common Latin and Greek roots include: "bio" (life), "geo" (earth), "graph" (write), "phon" (sound), and "scrib" (write).

Prefixes and suffixes: A prefix is added to the beginning of a word to change its meaning. "Un-" means not (unhappy), "re-" means again (rewrite), "pre-" means before (preview), "mis-" means wrongly (misunderstand). A suffix is added to the end: "-ful" (hopeful), "-less" (careless), "-tion" (action), "-er" (teacher). Recognising prefixes and suffixes helps decode and build new words.

Context clues: When a student meets an unfamiliar word, the surrounding sentence and paragraph often give clues to its meaning. A definition clue states the meaning directly: "The terrain, or landscape, was rocky." An example clue gives examples: "Citrus fruits, such as oranges and lemons, are rich in vitamin C." A contrast clue uses words like "but" or "however" to signal an opposite meaning.

Synonyms and antonyms: Synonyms are words with similar meanings (happy, joyful, content). Antonyms are words with opposite meanings (hot/cold, brave/cowardly). Using a variety of synonyms makes writing more interesting and precise.

Spelling strategies: The English spelling system has patterns students can learn. Doubling rules: when adding "-ing" or "-ed" to a short vowel word ending in a single consonant, double the consonant (run → running). Drop the silent "e" before a vowel suffix (hope → hoping). The "i before e except after c" rule helps in many cases (believe, receive).

Word origins (etymology): English borrows from many languages — Greek, Latin, French, Old English. Knowing that "telescope" comes from Greek "tele" (far) + "skopos" (watcher) makes the meaning obvious and memorable.

Using a dictionary and thesaurus: Students should practise using dictionaries to find meanings, pronunciation, and etymology. A thesaurus offers synonym choices. Digital tools like these are valuable lifelong research habits.

Vocabulary in reading: Meeting a new word in a rich context — a story, a science article, a poem — is one of the most powerful ways to learn it. Wide reading is the single best way to expand vocabulary naturally.`,
  },

  {
    id: "english-7-9-literary-analysis",
    subject: "English",
    grades: [7, 8, 9],
    title: "Literary Analysis",
    description: "Themes, characters, literary devices, and analysing prose and poetry",
    source: "Aligned with CK-12 Grade 7–9 English Language Arts (CC-BY-SA) and Cambridge Lower Secondary English",
    content: `Literary analysis means closely reading a text to understand how the author uses language, structure, and ideas to create meaning and effect.

Theme: The central idea or message of a text — what the author is saying about human experience. A story about a war might have themes of courage, loss, or the cost of conflict. Themes are not the plot (what happens) but the deeper meaning beneath it.

Character analysis: Explore characters through direct characterisation (the author tells you "she was kind") and indirect characterisation (the author shows you through dialogue, actions, thoughts, and others' reactions). Consider character development — how and why a character changes through the story.

Setting and atmosphere: Setting is not just background — it creates mood and can symbolise ideas. A stormy night during a confrontation, a decaying house for a troubled character — settings shape our emotional response.

Narrative voice and perspective: First-person narration (I) creates intimacy and unreliability. Third-person omniscient narration (he/she/they) allows multiple viewpoints. The narrator's tone — ironic, sympathetic, detached — affects how we read the story.

Literary devices: Metaphor, simile, personification, alliteration, onomatopoeia, hyperbole (exaggeration), irony (saying the opposite of what you mean), foreshadowing (hints of what comes later), and symbolism (objects or events representing something larger).

Poetry: Poetry uses line breaks, rhythm, and rhyme deliberately. Analyse the structure (sonnet, free verse), the rhythm (stressed and unstressed syllables), and the imagery. Ask: what feeling does this poem create, and how?

Writing analysis: When writing about literature, use evidence (quotations) and explain the effect. Structure: Point → Evidence (quote) → Explanation (what it means/how it works). Avoid plot summary — analysis focuses on how and why, not just what.`,
  },

  {
    id: "english-7-9-essay",
    subject: "English",
    grades: [7, 8, 9],
    title: "Essay Writing",
    description: "Planning, structuring and writing analytical and argumentative essays",
    source: "Aligned with CK-12 Grade 7–9 English Language Arts (CC-BY-SA) and Cambridge Lower Secondary English",
    content: `An essay is a focused piece of writing that makes and supports an argument or explores a question. Good essays are clearly planned, logically structured, and supported with evidence.

The five-paragraph essay: A useful structure for developing essay skills: Introduction (present the question and your thesis), Body Paragraph 1 (first point + evidence + explanation), Body Paragraph 2 (second point + evidence + explanation), Body Paragraph 3 (third point + evidence + explanation), Conclusion (restate thesis in new words, summarise key points, give a final thought).

The thesis statement: A thesis is your central argument or position, stated clearly in the introduction. "Shakespeare uses the theme of ambition in Macbeth to show that unchecked desire leads to destruction." A good thesis is arguable, specific, and guides the rest of the essay.

Body paragraphs: Each body paragraph develops one main point. Topic sentence → evidence or example → explanation of how this supports your argument. The PEEL structure: Point, Evidence, Explanation, Link (back to the question or next point).

Transitions: Words and phrases that connect ideas make an essay flow: "Furthermore," "However," "In contrast," "This demonstrates that," "Building on this," "Consequently."

Introductions: Engage the reader, provide necessary context, and end with a clear thesis. Avoid starting with "In this essay I will..." — instead, launch directly into the idea.

Conclusions: Restate your argument in fresh language. Draw together the threads of your essay. Leave the reader with a thoughtful final insight — do not introduce new arguments.

Referencing evidence: In literary essays, quote directly and briefly, then analyse. In academic essays, cite sources. Paraphrase (restate in your own words) rather than over-quoting.

Formal register: Essays use formal, precise language. Avoid contractions (it's → it is), slang, and first person (usually). Use subject-specific vocabulary correctly.`,
  },

  {
    id: "english-10-12-argument",
    subject: "English",
    grades: [10, 11, 12],
    title: "Persuasive & Argumentative Writing",
    description: "Argument structure, rhetoric, counterarguments, academic register",
    source: "Aligned with CK-12 Grade 10–12 English Language Arts (CC-BY-SA) and Cambridge IGCSE English",
    content: `Persuasive and argumentative writing uses evidence, logic, and rhetorical skill to convince a reader of a position. It is central to academic, professional, and civic life.

Argument vs persuasion: An argument relies on logic and evidence — the writer presents reasons, evidence, and reasoning to support a claim. Persuasion additionally appeals to emotions, values, and character (ethos, pathos, logos — Aristotle's rhetorical triangle).

Ethos, pathos, logos: Ethos is an appeal to the writer's credibility and character ("As a doctor, I can confirm…"). Pathos appeals to the reader's emotions ("Imagine a child without clean water…"). Logos appeals to logic and evidence ("Studies show a 40% reduction in…"). Effective persuasion usually combines all three.

Claim and evidence: A strong argument begins with a clear, debatable claim. Evidence supports the claim: statistics, expert opinion, examples, anecdotes, research studies. Evidence must be credible and relevant — not all evidence is equally convincing.

Counterarguments and refutation: Acknowledging and responding to opposing views strengthens your argument. Structure: "Some argue that [counterargument]. However, [your refutation + evidence]." This shows intellectual honesty and makes your position more convincing.

Logical fallacies: Errors in reasoning that undermine an argument. Ad hominem (attacking the person, not the argument), false dichotomy (presenting only two options when more exist), straw man (misrepresenting the opposing view), correlation vs causation (assuming cause from coincidence).

Structure for argumentative essays: Introduction with thesis → background context → series of supported claims → acknowledgement and refutation of counterarguments → conclusion that reinforces thesis and calls for action or reflection.

Formal academic register: Objective, precise, and impersonal. Use hedging language where appropriate: "evidence suggests," "it appears that," "this may indicate." Avoid emotional language in academic argument — let the evidence do the work.`,
  },

  {
    id: "english-10-12-world-literature",
    subject: "English",
    grades: [10, 11, 12],
    title: "World Literature",
    description: "Global literary traditions, post-colonial literature, comparative analysis",
    source: "Aligned with Cambridge IGCSE and A-Level Literature frameworks; UNESCO cultural diversity in education",
    content: `World literature encompasses literary works from all cultures, languages, and historical periods, revealing the shared and diverse aspects of human experience across the globe.

Literary traditions: Western literature builds on Greek and Roman foundations (Homer's Iliad and Odyssey, Virgil's Aeneid). Arabic literature has the rich tradition of the One Thousand and One Nights and classical poetry. African oral tradition — griots, praise poetry, folklore — predates written literature. Asian literature includes Sanskrit epics (Mahabharata, Ramayana), Chinese classical poetry, and Japanese haiku. Latin American literature produced the magical realism of Gabriel García Márquez and Jorge Luis Borges.

Post-colonial literature: Literature from formerly colonised nations grapples with the legacy of empire — identity, language, land, and cultural survival. Key writers: Chinua Achebe (Nigeria, Things Fall Apart), Ngugi wa Thiong'o (Kenya), Arundhati Roy (India), Chimamanda Ngozi Adichie (Nigeria). These works reclaim history and challenge narratives shaped by colonial powers.

Translation and loss: Much world literature reaches us in translation. The translator makes countless choices that affect tone, meaning, and style. Reading multiple translations of the same work reveals how much interpretation is involved.

Universal themes across cultures: Despite cultural differences, literature across the world explores the same fundamental concerns: love, loss, justice, identity, power, belonging, mortality. Comparative reading reveals both what is universal and what is culturally specific.

Critical lenses: Feminist criticism examines how gender is represented. Post-colonial criticism examines power, identity, and the legacy of colonialism. Marxist criticism focuses on class and economic forces. Psychoanalytic criticism explores the unconscious and motivation.

Comparative essay writing: When comparing texts, identify the thesis that links them. Structure body paragraphs around themes rather than text-by-text summaries. Show how different contexts produce different treatments of the same theme.`,
  },

  {
    id: "english-10-12-research",
    subject: "English",
    grades: [10, 11, 12],
    title: "Research & Academic Writing",
    description: "Finding and evaluating sources, citations, thesis development, academic register",
    source: "Aligned with OpenStax Writing Guide with Handbook (CC-BY) and Cambridge International AS & A Level English Language syllabus",
    content: `Academic writing is the formal, evidence-based writing used in schools, universities, and professional life. Research and academic writing skills are among the most transferable skills a student can develop.

Choosing a research question: A good research question is focused (not too broad), arguable (not just a fact), and significant (worth investigating). "What were the causes of World War I?" is broad. "To what extent was nationalism the primary cause of World War I?" is more focused and arguable.

Finding sources: Academic research uses primary sources (original documents, data, first-hand accounts) and secondary sources (analyses and interpretations by scholars). Reliable sources include peer-reviewed journals, textbooks, government reports, and reputable news organisations. Websites ending in .gov, .edu, and .org from established organisations are generally more reliable than personal blogs or anonymous content.

Evaluating sources — CRAAP test: Currency (Is it recent enough?), Relevance (Does it address your question?), Authority (Is the author qualified?), Accuracy (Is it supported by evidence?), Purpose (Is it informing or persuading?). Apply these questions to every source.

Thesis statement: The thesis is the central argument of your paper — one or two sentences stating your position and the main reasons supporting it. A strong thesis is specific, debatable, and supported by evidence throughout the essay.

Academic register: Academic writing is formal. Avoid contractions (use "do not" not "don't"), slang, and first-person opinions without evidence ("I think" → "Evidence suggests"). Use precise vocabulary, complete sentences, and logical transitions (furthermore, however, consequently, in contrast).

Citation and referencing: When using someone else's ideas or words, cite your source to give credit and allow readers to verify. Common citation styles include APA (sciences, social sciences), MLA (humanities), and Chicago (history). In-text citations name the author and year: (Smith, 2021). A reference list at the end gives full publication details.

Plagiarism: Plagiarism — presenting someone else's words or ideas as your own — is academic dishonesty. Paraphrase (restate in your own words) and always cite the source. Direct quotations must be in quotation marks with a citation.

Structure of a research essay: Introduction (context + thesis), body paragraphs (each with a clear topic sentence, evidence, and analysis), and conclusion (restate thesis in light of evidence, wider significance, open questions).

Revision process: After writing a first draft, revise for argument strength, then structure, then language, then proofreading. Reading aloud helps identify awkward sentences. Peer feedback improves writing significantly.`,
  },

  // ══════════════════════════════════════════════════════
  // HISTORY
  // ══════════════════════════════════════════════════════

  {
    id: "history-1-3-community",
    subject: "History",
    grades: [1, 2, 3],
    title: "My Community & Local History",
    description: "Families, communities, how places change over time",
    source: "Aligned with CK-12 Grade 1–3 Social Studies (CC-BY-SA) and UNESCO IBE Primary Curriculum",
    content: `History begins close to home. Understanding how our own community has changed over time is the foundation for understanding history on a larger scale.

Family history: Every family has its own history. Grandparents and great-grandparents lived in a different world — no smartphones, different schools, different work. Oral history means listening to and recording the stories of older family members. Photographs, letters, and documents are primary sources that tell us about the past.

How communities change: Communities grow, shrink, and change over time. New roads, buildings, schools, and businesses transform a place. Old photographs of the same street show what has changed and what has stayed the same. Interviewing older community members reveals memories of how things used to be.

Rules and laws: Communities have rules to keep everyone safe and to allow people to live together. At school, rules help everyone learn. In a town, laws control traffic, protect property, and ensure fairness. Who makes the rules? Who enforces them? How do they change?

Local leaders and heroes: Every community has people who have made it better — teachers, doctors, activists, founders. Learning about local history honours these contributions and shows students that ordinary people shape history.

Maps and places: Maps show us where things are and how a place is organised. Old maps compared to new maps show how a town or city has grown and changed. Street names, buildings, and monuments often carry historical stories.

Cultural traditions: Every community has festivals, foods, stories, and customs that come from its history and the different groups of people who have lived there. These traditions connect people to the past and to each other.

Primary and secondary sources: A primary source is something created at the time (a photograph, letter, diary). A secondary source is written later using primary sources (a history book). Historians use both to build a picture of the past.`,
  },

  {
    id: "history-1-3-cultures",
    subject: "History",
    grades: [1, 2, 3],
    title: "World Cultures & Traditions",
    description: "Diversity of cultures, celebrations, food, clothing and beliefs around the world",
    source: "Aligned with UNESCO Education for Intercultural Understanding and CK-12 Grade 1–3 Social Studies",
    content: `The world is home to thousands of different cultures — each with its own language, traditions, food, music, clothing, and beliefs. Learning about other cultures builds respect, curiosity, and a sense of global community.

What is culture? Culture is the shared way of life of a group of people — the customs, beliefs, arts, language, and social habits that are passed down through generations. Culture shapes how people celebrate, what they eat, how they greet each other, and what they value.

Celebrations and festivals: Every culture marks important moments with celebrations. Diwali (Festival of Lights) is celebrated by Hindus, Sikhs, and Jains. Eid al-Fitr marks the end of Ramadan for Muslims. Chinese New Year celebrates the lunar new year. Christmas marks the birth of Jesus for Christians. Many cultures celebrate harvests, new years, births, and coming-of-age milestones.

Food and clothing: Food reflects climate, history, and culture. Rice is central to many Asian cuisines; maize to many African and Latin American ones; wheat to European and Middle Eastern cooking. Traditional clothing — saris, kilts, kente cloth, cheongsam — reflects heritage and climate.

Language: There are approximately 7,000 languages spoken in the world today. Some, like Mandarin, Spanish, and English, are spoken by hundreds of millions. Others are spoken by only a few hundred people. Languages carry unique ways of seeing the world.

Respect and curiosity: Every culture has developed wisdom, art, and ways of living that deserve respect. No culture is superior to another — each is a different response to the challenges and joys of being human. Curiosity, not judgement, is the right attitude when learning about others.

Similarities: Despite all differences, all cultures share fundamental human experiences — family, community, celebration, grief, music, and storytelling. These connections remind us of our shared humanity.`,
  },

  {
    id: "history-4-6-ancient-civilisations",
    subject: "History",
    grades: [4, 5, 6],
    title: "Ancient Civilisations",
    description: "Mesopotamia, Egypt, the Indus Valley, China and their contributions",
    source: "Aligned with OpenStax World History Volume 1 (CC-BY) and CK-12 Grade 4–6 Social Studies",
    content: `Around 5,000 years ago, in several places around the world, the first great civilisations emerged — complex societies with cities, governments, writing, and specialised work.

Mesopotamia (modern Iraq): The land between the Tigris and Euphrates rivers — "the Cradle of Civilisation." The Sumerians developed one of the world's first writing systems, cuneiform (wedge-shaped marks on clay tablets), around 3200 BCE. They built city-states, developed law codes (Hammurabi's Code is one of the earliest), and made advances in mathematics and astronomy.

Ancient Egypt: The Nile River made Egypt fertile in a desert landscape. For 3,000 years, pharaohs ruled as god-kings. The Egyptians built the pyramids as tombs, developed hieroglyphics, created a 365-day calendar, and made advances in medicine. Mummification preserved bodies for the afterlife.

The Indus Valley Civilisation (modern Pakistan and India): One of the world's largest ancient civilisations, featuring planned cities like Mohenjo-daro with grid streets, advanced drainage systems, and standardised weights and measures. Their writing has not yet been fully deciphered.

Ancient China: China's Yellow River valley gave rise to the Shang Dynasty (about 1600–1046 BCE), which developed an early writing system and bronze casting. Later, China produced paper, printing, gunpowder, and the compass — inventions that transformed the world.

Ancient Greece: City-states like Athens and Sparta developed democracy, philosophy (Socrates, Plato, Aristotle), mathematics (Pythagoras, Euclid), and the Olympic Games. Greek culture deeply influenced Western civilisation.

Common features: All early civilisations shared certain features: organised government, social hierarchy, specialised work (farmers, priests, craftspeople, soldiers), large-scale architecture, writing, and long-distance trade.`,
  },

  {
    id: "history-4-6-figures",
    subject: "History",
    grades: [4, 5, 6],
    title: "Famous Historical Figures",
    description: "Leaders, scientists, explorers and activists who shaped history",
    source: "Aligned with CK-12 Grade 4–6 Social Studies (CC-BY-SA) and UNESCO World Heritage Education",
    content: `History is shaped by individuals who — through leadership, courage, creativity, or determination — changed the course of events for millions of people.

Great leaders: Alexander the Great (356–323 BCE) built an empire stretching from Greece to India, spreading Greek culture widely. Queen Elizabeth I of England (1533–1603) guided England through a golden age of exploration and the arts. Nelson Mandela (1918–2013) spent 27 years in prison for opposing apartheid and became South Africa's first democratically elected president.

Scientists and thinkers: Isaac Newton (1643–1727) discovered the laws of motion and gravity. Marie Curie (1867–1934) was the first woman to win a Nobel Prize — she won two, for physics and chemistry, and discovered radium and polonium. Charles Darwin (1809–1882) developed the theory of evolution through natural selection.

Explorers: Ibn Battuta (1304–1368) from Morocco travelled approximately 120,000 km across Africa, the Middle East, South Asia, and China — further than any traveller of his time. Zheng He, a Chinese admiral, led vast fleets across the Indian Ocean in the early 1400s. Amelia Earhart (1897–1937) was the first woman to fly solo across the Atlantic Ocean.

Social reformers and activists: Harriet Tubman (c.1822–1913) escaped slavery and helped hundreds of others to freedom through the Underground Railroad. Mahatma Gandhi (1869–1948) led India to independence through non-violent resistance. Malala Yousafzai (born 1997) survived an assassination attempt for advocating girls' education and became the youngest Nobel Prize laureate.

Lessons from historical figures: All these individuals faced opposition and hardship. Their stories show that individuals can change the world — and that change often requires courage, persistence, and a clear sense of purpose.`,
  },

  {
    id: "history-7-9-ancient",
    subject: "History",
    grades: [7, 8, 9],
    title: "Ancient Greece & Rome",
    description: "Greek democracy, Alexander the Great, Roman Republic and Empire",
    source: "Aligned with OpenStax World History Volume 1 (CC-BY) and CK-12 Grade 7–9 World History",
    content: `Ancient Greece and Rome gave rise to ideas about democracy, law, philosophy, and governance that still shape the modern world.

Ancient Greece: Greek civilisation flourished in city-states (poleis). Athens developed the world's first democracy (5th century BCE) — though limited to free male citizens. The Assembly (Ekklesia) allowed citizens to vote on laws and policy. Sparta, by contrast, was a military state with a dual kingship. Greek philosophy — Socrates, Plato, Aristotle — asked fundamental questions about knowledge, ethics, and governance. The Peloponnesian War (431–404 BCE) between Athens and Sparta weakened both city-states.

Alexander the Great: Macedonia's King Philip II united Greece. His son Alexander III (356–323 BCE) conquered Persia, Egypt, and lands as far as India in just 13 years, creating the largest empire the world had seen. He spread Greek culture (Hellenism) across the east, establishing cities like Alexandria. He died at 32, and his empire fragmented.

The Roman Republic: Founded in 509 BCE after expelling its last king, Rome was governed by the Senate and elected magistrates (consuls). The Republic expanded through conquest. The Twelve Tables codified Roman law. Tensions between patricians (elite) and plebeians (commoners) led to gradual reforms.

Julius Caesar: A brilliant general who conquered Gaul (modern France), crossed the Rubicon, and seized power in Rome. Assassinated in 44 BCE. His nephew Octavian defeated rivals to become Augustus, the first Roman Emperor, in 27 BCE.

The Roman Empire: At its peak, Rome controlled most of Europe, North Africa, and the Middle East. Roman achievements: engineering (roads, aqueducts, the Colosseum), Roman law (the basis of many modern legal systems), Latin (the root of French, Spanish, Italian, Portuguese, Romanian), and the spread of Christianity.

Fall of Rome: Pressures including economic troubles, military overstretch, political instability, and invasions by Germanic peoples led to the fall of the Western Roman Empire in 476 CE. The Eastern Empire (Byzantine) survived until 1453.`,
  },

  {
    id: "history-7-9-medieval",
    subject: "History",
    grades: [7, 8, 9],
    title: "Medieval World & Age of Exploration",
    description: "Feudalism, the Islamic Golden Age, Crusades, and European exploration",
    source: "Aligned with OpenStax World History Volume 1 (CC-BY) and CK-12 Grade 7–9 World History",
    content: `The medieval period (roughly 500–1500 CE) saw the rise of feudalism, great empires, the spread of religions, and eventually the Age of Exploration that connected the world.

Feudalism in Europe: After Rome's fall, Europe fragmented. Feudalism was a hierarchical system: kings granted land to nobles (lords) in exchange for military service; lords gave land to knights; peasants (serfs) worked the land in exchange for protection. The Catholic Church was enormously powerful — controlling education, influencing kings, and collecting taxes.

The Islamic Golden Age (8th–13th centuries): While Europe was largely in decline, the Islamic world flourished. Baghdad's House of Wisdom translated and preserved Greek texts and made advances in mathematics (algebra), astronomy, medicine (Ibn Sina/Avicenna), and philosophy. Islamic scholars helped transmit knowledge to later European thinkers.

The Mongol Empire: Genghis Khan (1162–1227) united Mongol tribes and conquered the largest contiguous land empire in history, stretching from China to Eastern Europe. The Pax Mongolica — Mongol peace — briefly enabled safe trade along the Silk Road, connecting East and West.

The Black Death: The bubonic plague (1347–1351) killed approximately one-third of Europe's population — perhaps 25 million people. It disrupted feudalism, led to labour shortages that gave surviving peasants more power, and prompted major social, economic, and religious changes.

The Crusades: A series of religious wars (1095–1291) in which European Christians attempted to retake Jerusalem from Muslim rule. The Crusades had complex consequences: increased trade between Europe and the Middle East, cultural exchange, but also enormous violence and lasting tensions.

Age of Exploration: From the 1400s, European nations sought sea routes to Asia for trade. Portugal led the way: Bartolomeu Dias rounded Africa (1488); Vasco da Gama reached India (1498). Christopher Columbus, funded by Spain, reached the Americas (1492), beginning a process that would transform the world.`,
  },

  {
    id: "history-7-9-industrial",
    subject: "History",
    grades: [7, 8, 9],
    title: "Industrial Revolution",
    description: "Causes, key inventions, social changes and global impact",
    source: "Aligned with OpenStax World History Volume 2 (CC-BY) and CK-12 Grade 7–9 World History",
    content: `The Industrial Revolution (roughly 1760–1840, beginning in Britain) transformed human society more profoundly than any development since the agricultural revolution — changing how people worked, lived, and organised society.

Causes: Britain had several advantages: coal and iron deposits, a stable government protecting property rights, a growing empire providing raw materials and markets, a tradition of practical invention, and an agricultural revolution that freed workers from the land and drove them to cities seeking work.

Key inventions: James Watt's improved steam engine (1769) powered factories and railways. The spinning jenny and power loom mechanised textile production. The steam locomotive (George Stephenson, 1829) revolutionised transport. The telegraph (1837) transformed communication.

Factories and urbanisation: Production moved from homes and small workshops to large factories. Cities grew explosively. Manchester's population grew from about 25,000 in 1772 to 300,000 by 1850. Urban conditions were often terrible — overcrowded, polluted, with no sanitation or welfare system.

Social changes: A new working class (proletariat) emerged — factory workers dependent on wages. A middle class of factory owners, merchants, and professionals grew wealthy. Children as young as five worked in mines and factories. Women worked but for lower wages. Labour movements and trade unions gradually won better conditions.

Global impact: British industrial goods flooded global markets, undermining local industries in India, Africa, and elsewhere. The Industrial Revolution intensified colonialism as European powers sought raw materials. The wealth gap between industrialised and non-industrialised nations grew dramatically.

Environmental impact: The burning of coal released carbon dioxide and began the process of anthropogenic climate change that continues today.

Reforms: Reformers fought for change. The Factory Act (1833) limited child labour. The 1832 Reform Act extended voting rights. Public health reforms addressed the horrific conditions in industrial cities.`,
  },

  {
    id: "history-10-12-world-wars",
    subject: "History",
    grades: [10, 11, 12],
    title: "World Wars I & II",
    description: "Causes, key events, consequences and the Holocaust",
    source: "Aligned with OpenStax World History Volume 2 (CC-BY) and UNESCO Holocaust Remembrance Education",
    content: `The two World Wars (1914–1918 and 1939–1945) were the most destructive conflicts in human history, killing an estimated 75 million people combined and reshaping the global order entirely.

World War I — Causes: The assassination of Archduke Franz Ferdinand of Austria-Hungary (June 1914) triggered a network of alliances into war. Underlying causes: nationalism, imperialism (competition for colonies), militarism (arms race), and the alliance system (Triple Entente vs Triple Alliance). A crisis in the Balkans — the "powder keg of Europe" — ignited the explosion.

WWI — Key events and technology: The Western Front became a stalemate of trenches stretching from the English Channel to Switzerland. New weapons — machine guns, poison gas, tanks, aircraft — made this the first truly industrial war. The Battle of the Somme (1916) killed over a million men. The USA entered in 1917; Germany collapsed in 1918.

WWI — Consequences: The Treaty of Versailles (1919) punished Germany harshly — reparations, territorial losses, military restrictions, and the "war guilt" clause. These humiliating terms contributed to German resentment that helped Hitler rise to power.

World War II — Rise of fascism: The Great Depression (1929) created economic desperation across Europe. In Germany, Adolf Hitler and the Nazi Party rose to power in 1933 on a platform of nationalism, antisemitism, and rejection of the Versailles Treaty. Italy under Mussolini and Japan under militarist leaders also pursued aggressive expansion.

WWII — Key events: Germany invaded Poland (1939), triggering declarations of war from Britain and France. France fell in 1940. The Battle of Britain (1940) was fought in the air. Germany invaded the Soviet Union (1941). Japan attacked Pearl Harbor, bringing the USA into the war. D-Day (June 6, 1944) — Allied invasion of Normandy. Germany surrendered May 1945; Japan surrendered September 1945 after atomic bombs destroyed Hiroshima and Nagasaki.

The Holocaust: The Nazi regime systematically murdered six million Jewish people and millions of others (Roma, disabled people, LGBTQ+ individuals, political opponents) in the Holocaust. The Nuremberg Trials (1945–46) established the principle of crimes against humanity and laid the foundation for international human rights law.`,
  },

  {
    id: "history-10-12-cold-war",
    subject: "History",
    grades: [10, 11, 12],
    title: "Cold War & Decolonisation",
    description: "USA vs USSR, proxy wars, African and Asian independence movements",
    source: "Aligned with OpenStax World History Volume 2 (CC-BY)",
    content: `After World War II, two superpowers — the United States and the Soviet Union — competed for global dominance in the Cold War (1947–1991), while colonial empires across Asia and Africa collapsed in waves of independence.

Origins of the Cold War: The USA and USSR had been wartime allies but held fundamentally incompatible ideologies: liberal democracy and capitalism vs communist one-party rule and state ownership of the economy. Tensions emerged immediately after WWII over the division of Europe and the occupation of Germany.

Key Cold War crises: The Berlin Blockade (1948–49), Korean War (1950–53), Cuban Missile Crisis (1962 — the closest the world came to nuclear war), Vietnam War (1955–75), and Soviet invasion of Afghanistan (1979).

Nuclear arms race: Both superpowers developed arsenals of nuclear weapons with the capacity to destroy civilisation many times over. Mutually Assured Destruction (MAD) — the understanding that a nuclear first strike would invite total destruction in return — paradoxically maintained an uneasy peace.

Proxy wars: The superpowers rarely fought directly but supported opposing sides in conflicts across the developing world — Korea, Vietnam, Angola, Nicaragua, Afghanistan. These wars caused enormous suffering in the countries involved.

Decolonisation: The weakening of European powers after WWII accelerated the independence of Asian and African nations. India gained independence in 1947. Ghana became the first sub-Saharan African nation to gain independence in 1957. By the 1960s, most of Africa was independent. The process was sometimes peaceful (Ghana), sometimes violent (Algeria, Kenya, Congo).

End of the Cold War: Economic stagnation and political repression weakened the Soviet Union. Mikhail Gorbachev's reforms (glasnost and perestroika) unleashed forces the system could not contain. The Berlin Wall fell in November 1989. The Soviet Union dissolved in December 1991.`,
  },

  {
    id: "history-10-12-contemporary",
    subject: "History",
    grades: [10, 11, 12],
    title: "Post-Cold War & Contemporary World",
    description: "Globalisation, 9/11 and the War on Terror, climate politics, and the rise of the digital age",
    source: "Aligned with OpenStax World History Vol. 2 (CC-BY) and UNESCO IBE History Curriculum Framework for Upper Secondary",
    content: `The period from 1991 to the present has been shaped by the collapse of the Soviet Union, the spread of globalisation, new forms of conflict, and transformative technological change.

The post-Cold War order: After 1991, the United States was the sole global superpower in what commentators called a "unipolar moment." NATO expanded eastward. The European Union deepened integration and expanded membership. Yet hopes for a stable, democratic world order were quickly challenged.

The Rwandan Genocide (1994): In 100 days, approximately 800,000 Tutsi and moderate Hutu were killed by Hutu extremists. The international community failed to intervene. The genocide became a defining case study in the failures of humanitarian intervention and the responsibilities of the international community.

Globalisation in the 1990s–2000s: The World Trade Organisation (WTO, 1995) promoted global free trade. Supply chains became truly global — a smartphone might be designed in the USA, with components made in Japan, South Korea, and Taiwan, assembled in China, and sold worldwide. This created wealth but also displaced workers and deepened inequality.

September 11, 2001 and the War on Terror: The al-Qaeda attacks on the United States killed nearly 3,000 people and launched a global "War on Terror." The US invaded Afghanistan (2001) to remove the Taliban and destroy al-Qaeda's base, and Iraq (2003) citing (disputed) weapons of mass destruction. Both wars proved far longer and more costly than anticipated and reshaped international relations, civil liberties debates, and the Middle East.

The Arab Spring (2010–2011): Popular uprisings across the Arab world — Tunisia, Egypt, Libya, Syria — challenged authoritarian governments. Results varied dramatically: Tunisia achieved a democratic transition; Syria descended into a devastating civil war that killed hundreds of thousands and displaced millions.

Climate change as a political challenge: The scientific consensus that human greenhouse gas emissions are causing dangerous climate change has been established since the 1990s. The Paris Agreement (2015) committed nations to limiting warming to 1.5–2°C above pre-industrial levels. Implementation remains contested, with tensions between economic development and emissions reduction — especially acute for developing nations.

The digital revolution and social media: The internet, smartphones, and social media have transformed communication, commerce, and politics. Social media has enabled mass mobilisation (Arab Spring, Black Lives Matter) but also the spread of misinformation. Digital surveillance by states and corporations raises profound questions about privacy and democracy.

Multipolarity and great power competition: The rise of China as an economic and military power, Russia's assertiveness (annexation of Crimea, 2014; invasion of Ukraine, 2022), and challenges to the post-WWII rules-based international order define the contemporary period. Questions about the future of democracy, multilateralism, and global governance are central to contemporary history.

Historians and the recent past: Writing history about events still unfolding is challenging — evidence is incomplete, perspectives are contested, and consequences are still playing out. Contemporary history requires critical evaluation of news sources, government statements, and competing narratives.`,
  },

  // ══════════════════════════════════════════════════════
  // GEOGRAPHY
  // ══════════════════════════════════════════════════════

  {
    id: "geo-1-3-maps",
    subject: "Geography",
    grades: [1, 2, 3],
    title: "Maps & Directions",
    description: "Reading maps, compass directions, symbols and scale",
    source: "Aligned with CK-12 Grade 1–3 Social Studies (CC-BY-SA) and UNESCO IBE Primary Geography",
    content: `A map is a drawing that shows what a place looks like from above — a "bird's-eye view." Maps help us find our way, understand where places are, and see how the land is organised.

Direction: We use compass directions to describe where things are. The four cardinal (main) directions are North, South, East, and West. An easy way to remember: Never Eat Shredded Wheat — N, E, S, W going clockwise. The sun rises in the east and sets in the west. A compass needle points to magnetic north.

Map keys and symbols: A map key (or legend) explains what each symbol means. A symbol is a small picture or colour that represents something in real life: a blue wavy line for a river, a green area for a park, a small house symbol for homes. Without a key, a map is very hard to read.

Scale: Maps are much smaller than the real places they show. The scale tells us how much smaller. A scale of 1:1,000 means 1 centimetre on the map equals 1,000 centimetres (10 metres) in real life. A scale bar shows this visually.

Types of maps: A physical map shows natural features — mountains, rivers, and lakes — using colours and contour lines. A political map shows countries and cities. A road map shows roads and routes. A weather map shows weather patterns.

Aerial photographs: Photographs taken from aeroplanes or satellites also show places from above, but unlike maps they are not simplified — they show everything. Comparing a map with an aerial photograph of the same area helps understand how maps are made.

Using maps: We use maps every day — to find a street, plan a journey, understand the news, or learn about other countries. Digital maps on smartphones update in real time and can show your location.`,
  },

  {
    id: "geo-1-3-continents",
    subject: "Geography",
    grades: [1, 2, 3],
    title: "Continents & Oceans",
    description: "The seven continents, five oceans, and major countries",
    source: "Aligned with CK-12 Grade 1–3 Social Studies (CC-BY-SA) and UNESCO IBE Primary Geography",
    content: `Earth's surface is divided into large landmasses (continents) and vast bodies of water (oceans). Knowing the continents and oceans is the foundation of world geography.

The seven continents: Asia is the largest continent — it covers about 30% of Earth's land area and is home to over 4 billion people. Africa is the second largest and the continent with the most countries (54). North America and South America are connected by a narrow strip of land (Panama). Europe is the smallest of the seven (excluding Australia/Oceania) but has had an enormous influence on world history. Antarctica is at the South Pole — almost entirely covered in ice and has no permanent human population. Australia (Oceania) is both a continent and a country — the only land mass that is both.

The five oceans: The Pacific Ocean is the largest — bigger than all continents combined. The Atlantic Ocean separates the Americas from Europe and Africa. The Indian Ocean is the third largest and is warm. The Arctic Ocean surrounds the North Pole and is covered in ice for much of the year. The Southern Ocean surrounds Antarctica.

Major countries: There are 195 countries in the world. The largest by area is Russia. The largest by population is India (recently surpassing China). The smallest country is Vatican City, inside Rome. Countries are grouped into continents based on their location.

The equator and poles: The equator is an imaginary line around the middle of the Earth, dividing it into the Northern and Southern Hemispheres. It is the hottest part of the Earth because sunlight hits most directly there. The North Pole and South Pole are the coldest because sunlight hits at a very low angle.

Longitude and latitude: These are imaginary grid lines used to pinpoint exact locations on Earth. Latitude lines run east-west and measure distance from the equator (0°). Longitude lines run north-south and measure distance from the Prime Meridian (0°) in Greenwich, England.`,
  },

  {
    id: "geo-4-6-climate",
    subject: "Geography",
    grades: [4, 5, 6],
    title: "Weather, Climate & Biomes",
    description: "Climate zones, tropical to polar climates, major biomes and their features",
    source: "Aligned with CK-12 Grade 4–6 Earth Science (CC-BY-SA) and UNESCO IBE Geography Curriculum",
    content: `Weather is what happens in the atmosphere day to day. Climate is the typical weather pattern over many years. Different parts of the world have different climates, and each climate supports a distinct biome — community of plants and animals.

Climate factors: Latitude is the most important factor — places near the equator are hot; places near the poles are cold. Altitude also matters — mountains are colder than valleys at the same latitude. Distance from the sea affects rainfall — coastal areas are wetter. Ocean currents warm or cool nearby land.

Climate zones: The tropical zone near the equator (0°–23.5°) is hot and wet year-round. The subtropical zone (23.5°–35°) includes hot deserts. The temperate zone (35°–60°) has warm summers and cool winters. The polar zone (above 60°) is very cold.

Major biomes: Tropical rainforests (Amazon, Congo, Southeast Asia) — hot, wet, extraordinarily biodiverse. Savannahs and grasslands (African savannah) — warm, seasonal rainfall, large herbivores and their predators. Deserts (Sahara, Arabian, Gobi) — very little rainfall, extreme temperatures. Temperate forests — deciduous trees that lose leaves in autumn. Boreal forest/taiga — conifer trees, cold winters, covering northern Russia and Canada. Tundra — treeless, frozen subsoil (permafrost), very cold, near the poles.

The water cycle and climate: Oceans absorb solar energy and release it slowly, moderating temperature. The Gulf Stream carries warm water from the Gulf of Mexico to northwest Europe, giving Britain a milder climate than its latitude would suggest.

Climate change: The burning of fossil fuels is increasing carbon dioxide concentrations in the atmosphere, intensifying the greenhouse effect. This is causing global temperatures to rise, ice sheets to melt, sea levels to rise, and weather patterns to become more extreme.`,
  },

  {
    id: "geo-4-6-environments",
    subject: "Geography",
    grades: [4, 5, 6],
    title: "Natural Environments",
    description: "Rivers, mountains, coasts, and how humans use natural environments",
    source: "Aligned with CK-12 Grade 4–6 Earth Science (CC-BY-SA) and Cambridge Primary Geography",
    content: `Natural environments are shaped by the forces of wind, water, ice, and tectonic activity over millions of years. Humans interact with and often transform these environments.

Rivers: Rivers begin as streams on high ground and flow downhill to the sea. Erosion — the wearing away of rock and soil by water — carves valleys over time. Rivers carry sediment which is deposited as the river slows, forming floodplains and deltas. Major rivers include the Nile (Africa), Amazon (South America), Yangtze (Asia), and Mississippi (North America). Rivers provide water, transport, and fertile land but can also flood.

Mountains: Mountains form through tectonic activity — plate collisions (fold mountains like the Himalayas and Andes), volcanic eruptions, and erosion. Mountains affect climate: the windward side of a mountain range receives heavy rainfall (relief rainfall); the leeward side is in a rain shadow and is much drier. Mountain communities have adapted to steep, cold, high-altitude conditions.

Coasts: Where land meets sea, waves shape the coastline. Erosion by waves creates cliffs, caves, arches, and stacks (rocky pillars). Deposition creates beaches, sand dunes, and spits. Coastal environments are some of the most densely populated on Earth and are threatened by rising sea levels.

Glaciers: Rivers of ice that move very slowly downhill, carving U-shaped valleys. During ice ages, glaciers covered much of the northern hemisphere. Today glaciers are retreating due to climate change.

Tectonic hazards: Earthquakes occur along fault lines where tectonic plates meet. Volcanoes erupt where magma reaches the surface — often near plate boundaries. Tsunamis are giant waves triggered by underwater earthquakes. Countries near plate boundaries (Japan, Indonesia, Chile) experience frequent earthquakes.

Human use and impact: Humans modify natural environments for agriculture, industry, housing, and tourism. Deforestation, mining, and urban development can degrade or destroy natural environments, leading to soil erosion, flooding, and biodiversity loss.`,
  },

  {
    id: "geo-7-9-physical",
    subject: "Geography",
    grades: [7, 8, 9],
    title: "Physical Geography",
    description: "Plate tectonics, river systems, glaciation and coastal processes",
    source: "Aligned with CK-12 Grade 7–9 Earth Science (CC-BY-SA) and Cambridge Lower Secondary Geography",
    content: `Physical geography studies the natural processes and features of Earth's surface — from the movements of tectonic plates to the shaping of rivers, glaciers, and coastlines.

Plate tectonics: Earth's crust is divided into about 15 major tectonic plates that move a few centimetres per year, driven by convection currents in the mantle. At constructive plate margins, plates move apart and magma rises to form new crust — mid-ocean ridges, rift valleys (like the East African Rift). At destructive margins, one plate subducts under another — this creates deep ocean trenches, fold mountains (Andes, Himalayas), and volcanic arcs (Pacific Ring of Fire). At conservative margins, plates slide past each other, causing earthquakes (San Andreas Fault, California).

River processes: Rivers erode (wear away rock), transport (carry material), and deposit (drop material). Erosion processes: hydraulic action (force of water), abrasion (material rubbing against the riverbed), attrition (material wearing against itself), solution (dissolving rock). Upper course: V-shaped valleys, waterfalls. Middle course: meanders begin. Lower course: wide floodplains, oxbow lakes, deltas at the mouth.

Glaciation: During ice ages, glaciers advance across the land. Glacial erosion creates corries (cirques), arêtes, pyramidal peaks, and U-shaped valleys. Glacial deposition leaves drumlins, moraines, and erratics (boulders dropped far from their origin).

Coastal processes: Waves erode coasts through hydraulic action, abrasion, and corrosion. Headlands and bays form where resistant and less resistant rock alternate. Longshore drift moves sediment along the coast. Constructive features: beaches, spits, bars, tombolos.

Weathering: Chemical weathering (carbonation dissolves limestone, producing caves and sinkholes), mechanical/physical weathering (freeze-thaw shatters rock), biological weathering (plant roots widen cracks).`,
  },

  {
    id: "geo-7-9-population",
    subject: "Geography",
    grades: [7, 8, 9],
    title: "Population & Migration",
    description: "Population distribution, demographic transition, push-pull migration factors",
    source: "Aligned with CK-12 Grade 7–9 Social Studies (CC-BY-SA) and UN Population Division data frameworks",
    content: `Human geography examines where people live, why populations change, and how and why people move from place to place.

Population distribution: The world's 8 billion people are not spread evenly. Densely populated areas: South and East Asia (India, China, Bangladesh), Western Europe, northeastern USA. Sparsely populated areas: deserts, tropical rainforests, polar regions, high mountains. Population density = number of people per km².

Factors affecting settlement: Fertile land for agriculture, reliable water supply, mild climate, flat land for building, natural resources, and trade routes attract population. Harsh climates, steep terrain, lack of water, and natural hazards deter settlement.

Population growth: World population was about 1 billion in 1800, 2 billion by 1930, 4 billion by 1975, and over 8 billion today. Growth is driven by the difference between birth rates and death rates. Improvements in medicine, sanitation, and food supply have dramatically reduced death rates.

The Demographic Transition Model: Describes how countries move through stages as they develop. Stage 1: high birth rate, high death rate — stable population. Stage 2: death rate falls (better medicine/food), birth rate still high — rapid growth. Stage 3: birth rate begins to fall — slowing growth. Stage 4: both rates low — stable population. Stage 5: birth rate may fall below death rate — declining population.

Migration: People move from place to place (migration) for push factors (reasons to leave — war, poverty, famine, persecution) and pull factors (reasons to move to a new place — jobs, safety, education, family). Internal migration moves within a country (rural to urban). International migration crosses borders.

Urbanisation: The movement of people from rural areas to cities. Currently over half of the world's population lives in cities. Rapid urbanisation in developing countries creates challenges: informal settlements (slums), lack of services, traffic, and pollution.

Refugees: People forced to leave their home country due to conflict or persecution. UNHCR (the UN Refugee Agency) reported over 100 million forcibly displaced people in 2022.`,
  },

  {
    id: "geo-7-9-resources",
    subject: "Geography",
    grades: [7, 8, 9],
    title: "Natural Resources",
    description: "Types of resources, energy, water scarcity and sustainable development",
    source: "Aligned with CK-12 Grade 7–9 Earth Science (CC-BY-SA) and UN Sustainable Development Goals framework",
    content: `Natural resources are materials found in nature that humans use to meet their needs — including fossil fuels, minerals, fresh water, soil, forests, and biodiversity.

Renewable vs non-renewable resources: Renewable resources can be replenished naturally — solar energy, wind, water (hydropower), forests (if managed sustainably), fish (if not over-harvested). Non-renewable resources take millions of years to form and will eventually run out — coal, oil, natural gas (fossil fuels), and many minerals.

Fossil fuels: Coal, oil, and natural gas formed from ancient organic matter over millions of years. They power most of the world's energy needs but release carbon dioxide when burned, contributing to climate change. Oil is also the raw material for plastics.

Energy and development: Access to reliable energy is closely linked to development. Rich countries use far more energy per person than poor countries. Global energy demand is rising, especially in rapidly developing economies like India and China. The transition to renewable energy is critical for climate goals.

Water resources: Only about 3% of Earth's water is fresh water, and most of that is locked in ice or deep underground. Fresh water for drinking, agriculture, and industry comes from rivers, lakes, and aquifers (underground water reserves). Water scarcity affects over 2 billion people. Causes: uneven distribution, overuse of aquifers, pollution, and climate change altering rainfall patterns.

Soil: Healthy soil takes hundreds of years to form but can be destroyed quickly by erosion, overfarming, and chemical pollution. Soil degradation threatens food security for billions of people.

Sustainable development: Development that meets the needs of the present without compromising the ability of future generations to meet their own needs (UN Brundtland Commission, 1987). The UN Sustainable Development Goals (SDGs, 2015) set 17 global targets including no poverty, clean water, affordable energy, and climate action.`,
  },

  {
    id: "geo-10-12-climate-change",
    subject: "Geography",
    grades: [10, 11, 12],
    title: "Climate Change & the Environment",
    description: "Causes, evidence, impacts and global responses to climate change",
    source: "Aligned with IPCC report frameworks and UNESCO Education for Sustainable Development",
    content: `Climate change — the long-term shift in global temperatures and weather patterns primarily caused by human activity since the mid-20th century — is the defining environmental challenge of the 21st century.

The greenhouse effect: Sunlight passes through the atmosphere and warms the Earth. The Earth radiates heat back, but greenhouse gases (CO₂, methane, nitrous oxide, water vapour) trap some of this heat. This natural greenhouse effect makes Earth habitable. Enhanced greenhouse effect: burning fossil fuels, deforestation, agriculture, and industry have increased greenhouse gas concentrations, trapping more heat.

Evidence for climate change: Average global surface temperature has risen by approximately 1.1°C since pre-industrial times (IPCC 2021). Arctic sea ice extent has declined 13% per decade since 1979. Sea levels are rising at 3.6 mm per year. Glaciers are retreating globally. Frequency and intensity of extreme weather events (heatwaves, storms, floods) has increased.

Impacts: Rising sea levels threaten low-lying coastal areas and island nations. Changing rainfall patterns cause drought in some regions and flooding in others. Ocean acidification (CO₂ dissolving in seawater) threatens coral reefs and marine life. Biodiversity loss accelerates as species cannot adapt fast enough. Food and water security is threatened, particularly in developing regions.

Mitigation: Reducing greenhouse gas emissions through transition to renewable energy (solar, wind, hydro), improving energy efficiency, reducing deforestation, shifting to plant-based diets, and carbon capture technologies. The Paris Agreement (2015) committed nations to limiting warming to 1.5–2°C above pre-industrial levels.

Adaptation: Adjusting to current and anticipated climate impacts — building sea defences, developing drought-resistant crops, redesigning cities for flooding, creating early warning systems.

Climate justice: The countries least responsible for climate change (low-income nations) often suffer the most severe impacts. Climate justice argues that wealthy nations have a responsibility to fund adaptation and mitigation in vulnerable countries.`,
  },

  {
    id: "geo-10-12-economic",
    subject: "Geography",
    grades: [10, 11, 12],
    title: "Economic Geography",
    description: "Global trade, development indicators, inequality and globalisation",
    source: "Aligned with CK-12 Grade 10–12 Social Studies (CC-BY-SA) and UN Development Programme frameworks",
    content: `Economic geography examines how economic activity is distributed across space — why some countries are wealthy and others poor, how trade connects the world, and how development can be measured.

Development and inequality: Countries are often classified as high, middle, or low income. The Gross Domestic Product (GDP) per capita measures average economic output per person. However, GDP alone misses health and education. The Human Development Index (HDI) combines income, life expectancy, and education to give a broader measure of wellbeing.

The development gap: There is a large and persistent gap between wealthy nations (concentrated in North America, Europe, Japan, and Australia) and poorer nations (much of sub-Saharan Africa, South Asia, and parts of Latin America and Southeast Asia). Causes include colonial legacies, trade barriers, debt, governance, geography, and access to technology.

International trade: Countries trade because they have different resources and capabilities. Comparative advantage: even if one country can produce everything more efficiently, both benefit from specialising and trading. Trade has grown enormously with globalisation. The World Trade Organization (WTO) regulates global trade rules.

Global supply chains: Most manufactured goods are assembled from components made in many countries. A smartphone's components might be designed in the USA, manufactured in South Korea and Japan, assembled in China, and sold globally. This creates complex interdependencies.

Transnational corporations (TNCs): Large companies operating in many countries. They create jobs but also face criticism for tax avoidance, low wages in poor countries, and environmental damage. Examples: Apple, Samsung, Unilever, Shell.

Aid and trade: Foreign aid (grants and loans from rich to poor countries) is controversial — critics argue it creates dependency; supporters argue it saves lives. Fair trade schemes ensure farmers in developing countries receive better prices for their products.

Sustainable development and the SDGs: The UN Sustainable Development Goals (17 goals, 193 countries, target 2030) address poverty, health, education, inequality, climate, and peace — recognising that all these challenges are interconnected.`,
  },

  {
    id: "geo-10-12-urbanisation",
    subject: "Geography",
    grades: [10, 11, 12],
    title: "Urbanisation & Globalisation",
    description: "Urban growth, megacities, smart cities, and how globalisation shapes the world",
    source: "Aligned with UN-Habitat Global Urban Monitoring Framework and UNESCO Social Sciences curriculum",
    content: `Urbanisation and globalisation are two of the most powerful forces reshaping human life in the 21st century — transforming where people live, how economies are connected, and how cultures interact.

Urbanisation: For the first time in history, more than half of the world's population (about 56%) lives in urban areas (2020). By 2050, this is projected to reach 68%. Urbanisation is fastest in Africa and Asia, where cities are growing by millions of people per year.

Megacities: Cities with over 10 million inhabitants. In 1970 there were 3 megacities; by 2020 there were over 30, mostly in Asia and Africa. Tokyo (37 million), Delhi (33 million), Shanghai (29 million), São Paulo (22 million). Megacities generate enormous economic output but also face enormous challenges.

Urban challenges: Rapid urbanisation in low-income countries often outpaces the ability to provide housing, water, sanitation, transport, and jobs. Informal settlements (slums) house over a billion people globally. Kampala, Lagos, Mumbai, and Dhaka all face severe urban inequality. Traffic congestion, air pollution, and urban heat islands also challenge cities.

Smart cities: Technology is being used to make cities more efficient — smart traffic management, digital public services, energy monitoring, and real-time data on air quality and transport. Singapore, Amsterdam, and Songdo (South Korea) are frequently cited as models.

Globalisation: The increasing interconnection of economies, cultures, and societies across the world — driven by trade, technology, migration, and communication. Globalisation has reduced extreme poverty in some regions (especially East Asia), spread ideas and culture globally, and created an integrated world economy.

Cultural globalisation: Global brands (McDonald's, Netflix, Nike), English as a global language, the internet, and migration are spreading certain cultural elements globally. Critics argue this threatens cultural diversity and local identities; proponents argue it enables cultural exchange and new hybrid cultures.

Counter-globalisation: Some argue that globalisation benefits wealthy nations and large corporations more than poor nations and workers. Movements for fair trade, local economies, and national sovereignty push back against some aspects of globalisation.`,
  },
];

// Helper: filter entries by subject and grade number
export function getLibraryEntries(subject: string, grade: number): CurriculumEntry[] {
  return CURRICULUM_LIBRARY.filter(
    (entry) =>
      entry.subject.toLowerCase() === subject.toLowerCase() &&
      entry.grades.includes(grade)
  );
}

// Helper: filter trusted sources by subject and grade
export function getTrustedSources(subject: string, grade: number): TrustedSource[] {
  return TRUSTED_SOURCES.filter(
    (s) =>
      s.subject.toLowerCase() === subject.toLowerCase() &&
      s.grades.includes(grade)
  );
}

// All unique subjects in the library
export const LIBRARY_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
];
