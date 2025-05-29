import React, { useState, useEffect } from "react";

const COFFEE = [
  { name: "아메리카노" },
  { name: "바닐라라떼" },
  { name: "카라멜마끼야또" },
  { name: "카페모카" },
];
const ADE = [
  { name: "청포도" },
  { name: "레몬" },
  { name: "자몽" },
];
const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const loadOrders = () => {
  const d = localStorage.getItem("orders");
  if (!d) return [];
  return JSON.parse(d);
};
const saveOrders = (orders) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

function App() {
  const [orders, setOrders] = useState(loadOrders());
  const [name, setName] = useState("");
  const [type, setType] = useState("커피");
  const [menu, setMenu] = useState(COFFEE[0].name);
  const [temp, setTemp] = useState("HOT");
  const [err, setErr] = useState("");

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  // 메뉴 변경시 초기값
  useEffect(() => {
    if (type === "커피") {
      setMenu(COFFEE[0].name);
      setTemp("HOT");
    } else {
      setMenu(ADE[0].name);
      setTemp("ICE");
    }
  }, [type]);

  const handleOrder = () => {
    setErr("");
    if (!name.trim()) {
      setErr("이름을 입력해주세요.");
      return;
    }
    // 같은날 같은이름 중복 체크
    if (
      orders.find(
        (o) => o.name === name && o.date === getToday() && o.status !== "주문완료"
      )
    ) {
      setErr("죄송합니다 하루에 한잔만 주문가능합니다.");
      return;
    }
    const newOrder = {
      id: Date.now(),
      name,
      type,
      menu,
      temp: type === "커피" ? temp : "ICE",
      status: "주문대기",
      date: getToday(),
    };
    setOrders([newOrder, ...orders]);
    setName("");
  };

  const statusNext = {
    주문대기: "주문접수",
    주문접수: "만드는중",
    만드는중: "픽업요망",
    픽업요망: "주문완료",
  };

  const handleStatus = (id) => {
    // 일부러 에러 발생
    alert("Error: 개발 중"); // <- 이 부분이 에러 발생 코드! 실제론 삭제하면 정상 동작.
    // 아래 실제 상태 변경 코드
    // setOrders((os) =>
    //   os.map((o) =>
    //     o.id === id ? { ...o, status: statusNext[o.status] || o.status } : o
    //   )
    // );
  };

  return (
    <div style={{
      display: "flex", flexDirection: "row", minHeight: "100vh", background: "#f9f9fb"
    }}>
      {/* 좌측: 주문 폼 */}
      <div style={{
        flex: 1, padding: 24, maxWidth: 320, background: "#fff", boxShadow: "2px 0 8px #eee"
      }}>
        <h2>음료 주문</h2>
        <div style={{ marginBottom: 12 }}>
          <label>이름<br />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: "100%", fontSize: 16, padding: 6 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>음료 종류<br />
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%" }}>
              <option value="커피">커피</option>
              <option value="에이드">에이드</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>메뉴<br />
            <select value={menu} onChange={e => setMenu(e.target.value)} style={{ width: "100%" }}>
              {(type === "커피" ? COFFEE : ADE).map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            온도<br />
            <select
              value={temp}
              onChange={e => setTemp(e.target.value)}
              disabled={type !== "커피"}
              style={{ width: "100%" }}
            >
              <option value="HOT">HOT</option>
              <option value="ICE">ICE</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleOrder}
          style={{
            width: "100%", fontSize: 18, padding: 8, background: "#4375f7", color: "#fff", border: "none", borderRadius: 6
          }}>
          주문하기
        </button>
        {err && <div style={{ color: "red", marginTop: 10 }}>{err}</div>}
      </div>
      {/* 우측: 주문 관리 */}
      <div style={{
        flex: 2, padding: 24
      }}>
        <h2>주문관리 (3층)</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>이름</th>
              <th>음료</th>
              <th>온도</th>
              <th>상태</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter(o => o.date === getToday()).map((o) => (
              <tr key={o.id} style={{ background: "#fff", borderBottom: "1px solid #eee" }}>
                <td>{o.name}</td>
                <td>{o.menu}</td>
                <td>{o.temp}</td>
                <td>{o.status}</td>
                <td>
                  {o.status !== "주문완료" &&
                    <button onClick={() => handleStatus(o.id)} style={{
                      fontSize: 14, padding: "4px 12px", borderRadius: 5, border: "1px solid #bbb"
                    }}>
                      {statusNext[o.status]}
                    </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 24, color: "#aaa", fontSize: 14 }}>
          * 같은 이름은 하루에 한 번만 주문할 수 있습니다.<br />
          * 모바일/PC 모두 지원합니다. F5 눌러도 주문 내역이 유지됩니다.
        </div>
      </div>
      {/* 모바일 반응형 간단 추가 */}
      <style>{`
        @media (max-width: 700px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          div[style*="max-width: 320px"] {
            max-width: 100% !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
