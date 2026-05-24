import React, { useState } from "react";
import "./App.css";

function App() {
  const [careerGoal, setCareerGoal] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [page, setPage] = useState("signup");
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paidCourse, setPaidCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    { id: 1, name: "Java Full Stack", price: 4999, tag: "Popular", desc: "Spring Boot + React + MySQL", duration: "3 Months", lessons: 45 },
    { id: 2, name: "React Mastery", price: 2999, tag: "Hot", desc: "Build modern frontend apps", duration: "2 Months", lessons: 32 },
    { id: 3, name: "Backend APIs", price: 3999, tag: "New", desc: "REST API + Database + Security", duration: "2.5 Months", lessons: 38 },
  ];

 const recommendCourse = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Recommend one best course from Java Full Stack, React Mastery, Backend APIs for this goal: ${careerGoal}`,
      }),
    });

    const text = await response.text();
    console.log("AI RAW RESPONSE:", text);

    const data = JSON.parse(text);

    const answer =
      data?.choices?.[0]?.message?.content || "No AI answer found.";

    setAiResult(answer);
  } catch (error) {
    console.error("AI ERROR:", error);
    setAiResult("AI recommendation failed ❌ Check console for error.");
  }
};

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const signup = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    localStorage.setItem("paylearnUser", JSON.stringify({ name, email, password }));
    alert("Signup successful ✅ Now login");
    setPage("login");
  };

  const login = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("paylearnUser"));

    if (saved && saved.email === e.target.email.value && saved.password === e.target.password.value) {
      setUser(saved);
      setPage("home");
    } else {
      alert("Invalid email or password ❌");
    }
  };

  const buyNow = (course) => {
    setSelectedCourse(course);
  };

  const confirmPayment = () => {
    const bill = {
      billId: "BILL" + Date.now(),
      paymentId: "PAY" + Date.now(),
      course: selectedCourse.name,
      description: selectedCourse.desc,
      amount: selectedCourse.price,
      duration: selectedCourse.duration,
      lessons: selectedCourse.lessons,
      date: new Date().toLocaleString(),
      status: "SUCCESS",
    };

    const oldOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    localStorage.setItem("orderHistory", JSON.stringify([...oldOrders, bill]));

    setPaidCourse(bill);
    setSelectedCourse(null);
  };

  if (page === "signup") {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <h1>PayLearn</h1>
          <p>Start learning premium tech skills with a colorful payment experience.</p>
        </div>

        <form className="auth-card" onSubmit={signup}>
          <h2>Create Account ✨</h2>
          <input name="name" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="Email Address" required />
          <input name="password" type="password" placeholder="Password" required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
          <button>Create Account</button>
          <p>Already joined? <span onClick={() => setPage("login")}>Login</span></p>
        </form>
      </div>
    );
  }

  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <h1>Welcome Back</h1>
          <p>Login and continue your learning journey with secure demo payments.</p>
        </div>

        <form className="auth-card" onSubmit={login}>
          <h2>Login 🚀</h2>
          <input name="email" type="email" placeholder="Email Address" required />
          <input name="password" type="password" placeholder="Password" required />
          <button>Login</button>
          <p>New here? <span onClick={() => setPage("signup")}>Signup</span></p>
          <p>Admin? <span onClick={() => setPage("adminLogin")}>Admin Login</span></p>
        </form>
      </div>
    );
  }

  if (page === "adminLogin") {
    return (
      <div className="auth-page">
        <div className="auth-left">
          <h1>Admin Panel</h1>
          <p>Manage courses, users, and payment records.</p>
        </div>

        <form
          className="auth-card"
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            if (email === "admin@paylearn.com" && password === "admin123") {
              setPage("adminDashboard");
            } else {
              alert("Invalid admin login ❌");
            }
          }}
        >
          <h2>Admin Login 🔐</h2>
          <input name="email" type="email" placeholder="Admin Email" required />
          <input name="password" type="password" placeholder="Admin Password" required />
          <button>Login as Admin</button>
          <p>Back to user login? <span onClick={() => setPage("login")}>Login</span></p>
        </form>
      </div>
    );
  }

  if (page === "adminDashboard") {
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const savedUser = JSON.parse(localStorage.getItem("paylearnUser"));

    return (
      <div className="admin-page">
        <nav className="admin-navbar">
          <h2>PayLearn Admin</h2>
          <button onClick={() => setPage("login")}>Logout</button>
        </nav>

        <section className="admin-hero">
          <h1>Admin Dashboard</h1>
          <p>High level access to manage courses, users, and order history.</p>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card"><h2>{courses.length}</h2><p>Total Courses</p></div>
          <div className="admin-stat-card"><h2>{orders.length}</h2><p>Total Orders</p></div>
          <div className="admin-stat-card"><h2>{savedUser ? 1 : 0}</h2><p>Registered Users</p></div>
        </section>

        <section className="admin-section">
          <h2>Course Management</h2>
          {courses.map((course) => (
            <div className="admin-row" key={course.id}>
              <span>{course.name}</span>
              <span>₹{course.price}</span>
              <span>{course.tag}</span>
            </div>
          ))}
        </section>

        <section className="admin-section">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div className="admin-row" key={order.billId}>
                <span>{order.course}</span>
                <span>₹{order.amount}</span>
                <span>{order.status}</span>
              </div>
            ))
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="home">
      <nav className="navbar">
        <h2>PayLearn</h2>
        <div>
          <span>Hi, {user?.name}</span>
          <button onClick={() => { setUser(null); setPage("login"); }}>Logout</button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>Learn. Pay. Grow.</h1>
          <p>Upgrade your skills with industry-ready online courses, hands-on projects, secure payments, and interactive learning.</p>
          <button onClick={() => document.getElementById("courses").scrollIntoView()}>Explore Courses</button>
        </div>
      </section>

      <section className="courses" id="courses">
        <h2>Premium Courses</h2>

        <input
          className="search-box"
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="ai-box">
          <h2>🤖 AI Course Recommendation</h2>
          <p>Tell us your goal and get the best course suggestion.</p>

          <input
            type="text"
            placeholder="Example: I want backend job using Java"
            value={careerGoal}
            onChange={(e) => setCareerGoal(e.target.value)}
          />

          <button onClick={recommendCourse}>Get AI Recommendation</button>

          {aiResult && <h3>{aiResult}</h3>}
        </div>

        <div className="course-grid">
          {filteredCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="tag">{course.tag}</div>
              <h3>{course.name}</h3>
              <p>{course.desc}</p>

              <div className="course-info">
                <span>⏱ {course.duration}</span>
                <span>📘 {course.lessons} lessons</span>
              </div>

              <h2>₹{course.price}</h2>
              <button onClick={() => buyNow(course)}>Buy Now</button>
            </div>
          ))}
        </div>
      </section>

      {selectedCourse && (
        <div className="modal">
          <div className="bill-card">
            <h2>Confirm Purchase 🧾</h2>
            <p><b>Course:</b> {selectedCourse.name}</p>
            <p><b>Description:</b> {selectedCourse.desc}</p>
            <p><b>Duration:</b> {selectedCourse.duration}</p>
            <p><b>Lessons:</b> {selectedCourse.lessons}</p>
            <hr />
            <h3>Total Payable: ₹{selectedCourse.price}</h3>
            <button className="pay-btn" onClick={confirmPayment}>Confirm & Pay</button>
            <button className="cancel-btn" onClick={() => setSelectedCourse(null)}>Cancel</button>
          </div>
        </div>
      )}

      {paidCourse && (
        <div className="modal">
          <div className="bill-card">
            <h2>Bill Generated ✅</h2>
            <p><b>Bill ID:</b> {paidCourse.billId}</p>
            <p><b>Payment ID:</b> {paidCourse.paymentId}</p>
            <p><b>Course:</b> {paidCourse.course}</p>
            <p><b>Description:</b> {paidCourse.description}</p>
            <p><b>Duration:</b> {paidCourse.duration}</p>
            <p><b>Lessons:</b> {paidCourse.lessons}</p>
            <p><b>Amount:</b> ₹{paidCourse.amount}</p>
            <p><b>Date:</b> {paidCourse.date}</p>
            <p><b>Status:</b> {paidCourse.status}</p>

            <button className="pay-btn" onClick={() => window.print()}>Print Bill</button>
            <button className="cancel-btn" onClick={() => setPaidCourse(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;