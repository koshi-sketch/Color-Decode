import { useState, useRef, useEffect } from "react";

const ALL_COLORS = [
  { id: "red",           bg: "#ef4444" },
  { id: "orange",        bg: "#f97316" },
  { id: "yellow",        bg: "#eab308" },
  { id: "green",         bg: "#22c55e" },
  { id: "blue",          bg: "#3b82f6" },
  { id: "purple",        bg: "#a855f7" },
  // 7-12: striped versions (same base colors, stripe flag)
  { id: "red-s",         bg: "#ef4444", stripe: true },
  { id: "orange-s",      bg: "#f97316", stripe: true },
  { id: "yellow-s",      bg: "#eab308", stripe: true },
  { id: "green-s",       bg: "#22c55e", stripe: true },
  { id: "blue-s",        bg: "#3b82f6", stripe: true },
  { id: "purple-s",      bg: "#a855f7", stripe: true },
];

// ── i18n ─────────────────────────────────────────────────────────────────────
const LANGS = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "id", label: "Indonesia" },
  { code: "th", label: "ภาษาไทย" },
];

const T = {
  ja: {
    title: "Color Decode",
    subtitle: "— カラーコードを解読せよ —",
    mode: "モード",
    mode1p: "1P モード",
    mode2p: "2P モード",
    mode2pVs: "CPUがコードを設定",
    mode2pVsDesc: "先に解除した方が勝ち",
    mode2pBattle: "お互いにコードを設定",
    colors: "色の種類",
    codeLength: "コードの桁数",
    maxGuesses: "最大試行回数",
    allowDuplicates: "同色あり",
    start: "スタート",
    player1: "プレイヤー1",
    player2: "プレイヤー2",
    setCode: "コードを設定",
    nodup: "同色なし",
    hiddenWarning: "相手に見られないように入力してね",
    confirm: "確定 →",
    check: "確認",
    hide: "隠す",
    remaining: (n) => `残り ${n} 手`,
    clear: "クリア",
    submit: "判定 →",
    yourTurn: "◀ あなたのターン",
    waiting: "相手のターン待ち…",
    turn: (n) => `TURN ${n}`,
    gameOver: "GAME OVER",
    next: "次へ →",
    success: (n) => `解除成功 / ${n}手`,
    failure: "解除失敗",
    result: "結果",
    youWin: "あなたの勝ち",
    youLose: "あなたの負け",
    draw: "引き分け",
    playAgain: "もう一度",
    goHome: "ホームへ",
    menu: "メニュー",
    bgColor: "背景色",
    bgDark: "黒",
    bgLight: "白",
    vibration: "ターン交代バイブ",
    restart: "初めからやり直す",
    home: "ホームに戻る",
    handoffTitle: "スマホを渡してください",
    handoffDesc: (p) => `${p}がコードを設定します。画面を相手に見せないように！`,
    handoffBtn: (p) => `${p}のコードを設定する →`,
    adSpace: "広告スペース",
    language: "言語",
    unlock: "フルバージョンを解放",
    unlockDesc: "色12色・桁数8桁・試行30回・同色あり・広告なし",
    unlockBtn: "解放する",
    unlockCancel: "キャンセル",
    howToPlay: "遊び方",
    howToPlayTitle: "遊び方",
    howToPlayClose: "閉じる",
    rules: [
      { title: "目的", desc: "隠されたカラーコードを制限手数以内に解読しよう！" },
      { title: "色を選ぶ", desc: "パレットから色を選んでスロットに配置する。" },
      { title: "判定する", desc: "「判定」ボタンを押すと結果が表示される。" },
      { title: "赤ペグ", desc: "位置も色も正解！" },
      { title: "白ペグ", desc: "色は正解だが位置が違う。" },
      { title: "2Pモード（対戦）", desc: "お互いにコードを設定して当て合う。少ない手数で当てた方が勝ち！" },
      { title: "2Pモード（CPU）", desc: "CPUが設定したコードを2人で交互に挑戦。先に解読した方が勝ち！" },
    ],
    unlockPrice: "¥400",
    unlocked: "解放済み",
    premiumBadge: "PRO",
    freeLimit: "無料版では制限があります",
  },
  en: {
    title: "Color Decode",
    subtitle: "— CRACK THE COLOR CODE —",
    mode: "Mode",
    mode1p: "1P Mode",
    mode2p: "2P Mode",
    mode2pVs: "CPU sets the code",
    mode2pVsDesc: "First to crack the code wins",
    mode2pBattle: "Players set each other's code",
    colors: "Colors",
    codeLength: "Code Length",
    maxGuesses: "Max Guesses",
    allowDuplicates: "Allow Duplicates",
    start: "Start",
    player1: "Player 1",
    player2: "Player 2",
    setCode: "Set Your Code",
    nodup: "No duplicates",
    hiddenWarning: "Don't let your opponent see!",
    confirm: "Confirm →",
    check: "Reveal",
    hide: "Hide",
    remaining: (n) => `${n} guesses left`,
    clear: "Clear",
    submit: "Submit →",
    yourTurn: "◀ Your Turn",
    waiting: "Waiting for opponent…",
    turn: (n) => `TURN ${n}`,
    gameOver: "GAME OVER",
    next: "Next →",
    success: (n) => `Decoded! / ${n} moves`,
    failure: "Failed",
    result: "Result",
    youWin: "You Win!",
    youLose: "You Lose",
    draw: "Draw",
    playAgain: "Play Again",
    goHome: "Home",
    menu: "Menu",
    bgColor: "Background",
    bgDark: "Dark",
    bgLight: "Light",
    vibration: "Turn Vibration",
    restart: "Restart",
    home: "Go Home",
    handoffTitle: "Pass the phone",
    handoffDesc: (p) => `${p} will now set their code. Don't show the screen!`,
    handoffBtn: (p) => `${p}: Set Code →`,
    adSpace: "Ad Space",
    language: "Language",
    unlock: "Unlock Full Version",
    unlockDesc: "12 colors, 8 digits, 30 guesses, duplicates & no ads",
    unlockBtn: "Unlock",
    unlockCancel: "Cancel",
    howToPlay: "How to Play",
    howToPlayTitle: "How to Play",
    howToPlayClose: "Close",
    rules: [
      { title: "Goal", desc: "Crack the hidden color code within the allowed number of guesses!" },
      { title: "Pick Colors", desc: "Select a color from the palette and tap a slot to place it." },
      { title: "Submit", desc: "Tap Submit to get feedback on your guess." },
      { title: "Red Peg", desc: "Correct color AND position!" },
      { title: "White Peg", desc: "Correct color but wrong position." },
      { title: "2P Battle", desc: "Each player sets a code for the other. Fewest guesses wins!" },
      { title: "2P vs CPU", desc: "CPU sets one code. Take turns guessing. First to crack it wins!" },
    ],
    unlockPrice: "$2.99",
    unlocked: "Unlocked",
    premiumBadge: "PRO",
    freeLimit: "Limited in free version",
  },
  ko: {
    title: "Color Decode",
    subtitle: "— 색상 코드를 해독하라 —",
    mode: "모드",
    mode1p: "1인 모드",
    mode2p: "2인 모드",
    mode2pVs: "CPU가 코드 설정",
    mode2pVsDesc: "먼저 해독한 사람이 승리",
    mode2pBattle: "서로 코드 설정",
    colors: "색상 수",
    codeLength: "코드 자리 수",
    maxGuesses: "최대 시도 횟수",
    allowDuplicates: "중복 허용",
    start: "시작",
    player1: "플레이어 1",
    player2: "플레이어 2",
    setCode: "코드 설정",
    nodup: "중복 없음",
    hiddenWarning: "상대방이 보지 못하게 입력하세요!",
    confirm: "확인 →",
    check: "확인",
    hide: "숨기기",
    remaining: (n) => `남은 시도: ${n}`,
    clear: "지우기",
    submit: "제출 →",
    yourTurn: "◀ 당신의 차례",
    waiting: "상대방 차례 대기 중…",
    turn: (n) => `TURN ${n}`,
    gameOver: "게임 오버",
    next: "다음 →",
    success: (n) => `해독 성공 / ${n}번`,
    failure: "실패",
    result: "결과",
    youWin: "승리!",
    youLose: "패배",
    draw: "무승부",
    playAgain: "다시 하기",
    goHome: "홈으로",
    menu: "메뉴",
    bgColor: "배경색",
    bgDark: "어둡게",
    bgLight: "밝게",
    vibration: "턴 진동",
    restart: "처음부터",
    home: "홈으로 돌아가기",
    handoffTitle: "폰을 넘겨주세요",
    handoffDesc: (p) => `${p}가 코드를 설정합니다. 화면을 보여주지 마세요!`,
    handoffBtn: (p) => `${p}: 코드 설정 →`,
    adSpace: "광고",
    language: "언어",
    unlock: "전체 버전 해제",
    unlockDesc: "12색, 8자리, 30회, 중복 허용, 광고 없음",
    unlockBtn: "해제",
    unlockCancel: "취소",
    howToPlay: "게임 방법",
    howToPlayTitle: "게임 방법",
    howToPlayClose: "닫기",
    rules: [
      { title: "목표", desc: "제한된 횟수 안에 숨겨진 색상 코드를 해독하세요!" },
      { title: "색상 선택", desc: "팔레트에서 색상을 선택하고 슬롯에 배치하세요." },
      { title: "제출", desc: "제출 버튼을 눌러 결과를 확인하세요." },
      { title: "빨간 핀", desc: "색상과 위치 모두 정확!" },
      { title: "흰색 핀", desc: "색상은 맞지만 위치가 틀림." },
      { title: "2인 대결", desc: "서로 코드를 설정하고 맞춰보세요. 적은 횟수로 맞춘 사람이 승리!" },
      { title: "2인 vs CPU", desc: "CPU가 설정한 코드를 교대로 도전. 먼저 해독한 사람이 승리!" },
    ],
    unlockPrice: "₩3,900",
    unlocked: "해제됨",
    premiumBadge: "PRO",
    freeLimit: "무료 버전에서는 제한됩니다",
  },
  fr: {
    title: "Color Decode",
    subtitle: "— DÉCHIFFREZ LE CODE COULEUR —",
    mode: "Mode",
    mode1p: "Mode 1J",
    mode2p: "Mode 2J",
    mode2pVs: "Le CPU définit le code",
    mode2pVsDesc: "Le premier à déchiffrer gagne",
    mode2pBattle: "Les joueurs définissent leurs codes",
    colors: "Couleurs",
    codeLength: "Longueur du code",
    maxGuesses: "Essais max",
    allowDuplicates: "Doublons autorisés",
    start: "Démarrer",
    player1: "Joueur 1",
    player2: "Joueur 2",
    setCode: "Définir votre code",
    nodup: "Sans doublons",
    hiddenWarning: "Ne montrez pas l'écran à votre adversaire !",
    confirm: "Confirmer →",
    check: "Révéler",
    hide: "Cacher",
    remaining: (n) => `${n} essais restants`,
    clear: "Effacer",
    submit: "Valider →",
    yourTurn: "◀ Votre tour",
    waiting: "En attente de l'adversaire…",
    turn: (n) => `TOUR ${n}`,
    gameOver: "FIN DE PARTIE",
    next: "Suivant →",
    success: (n) => `Décodé ! / ${n} coups`,
    failure: "Échec",
    result: "Résultat",
    youWin: "Vous gagnez !",
    youLose: "Vous perdez",
    draw: "Égalité",
    playAgain: "Rejouer",
    goHome: "Accueil",
    menu: "Menu",
    bgColor: "Arrière-plan",
    bgDark: "Sombre",
    bgLight: "Clair",
    vibration: "Vibration de tour",
    restart: "Recommencer",
    home: "Retour à l'accueil",
    handoffTitle: "Passez le téléphone",
    handoffDesc: (p) => `${p} va définir son code. Ne montrez pas l'écran !`,
    handoffBtn: (p) => `${p} : Définir le code →`,
    adSpace: "Publicité",
    language: "Langue",
    unlock: "Débloquer la version complète",
    unlockDesc: "12 couleurs, 8 chiffres, 30 essais, doublons & sans pub",
    unlockBtn: "Débloquer",
    unlockCancel: "Annuler",
    howToPlay: "Comment jouer",
    howToPlayTitle: "Comment jouer",
    howToPlayClose: "Fermer",
    rules: [
      { title: "Objectif", desc: "Déchiffrez le code couleur caché en un nombre limité d'essais !" },
      { title: "Choisir", desc: "Sélectionnez une couleur et placez-la dans un emplacement." },
      { title: "Valider", desc: "Appuyez sur Valider pour obtenir un retour." },
      { title: "Pion rouge", desc: "Couleur ET position correctes !" },
      { title: "Pion blanc", desc: "Bonne couleur mais mauvaise position." },
      { title: "2J Bataille", desc: "Chaque joueur définit un code. Le moins d'essais gagne !" },
      { title: "2J vs CPU", desc: "Le CPU définit un code. À tour de rôle, le premier à déchiffrer gagne !" },
    ],
    unlockPrice: "2,99 €",
    unlocked: "Débloqué",
    premiumBadge: "PRO",
    freeLimit: "Limité en version gratuite",
  },
  es: {
    title: "Color Decode",
    subtitle: "— DESCIFRA EL CÓDIGO DE COLOR —",
    mode: "Modo",
    mode1p: "Modo 1J",
    mode2p: "Modo 2J",
    mode2pVs: "CPU establece el código",
    mode2pVsDesc: "El primero en descifrar gana",
    mode2pBattle: "Los jugadores establecen sus códigos",
    colors: "Colores",
    codeLength: "Longitud del código",
    maxGuesses: "Intentos máx.",
    allowDuplicates: "Permitir duplicados",
    start: "Iniciar",
    player1: "Jugador 1",
    player2: "Jugador 2",
    setCode: "Establece tu código",
    nodup: "Sin duplicados",
    hiddenWarning: "¡No dejes que tu rival vea la pantalla!",
    confirm: "Confirmar →",
    check: "Revelar",
    hide: "Ocultar",
    remaining: (n) => `${n} intentos restantes`,
    clear: "Borrar",
    submit: "Enviar →",
    yourTurn: "◀ Tu turno",
    waiting: "Esperando al rival…",
    turn: (n) => `TURNO ${n}`,
    gameOver: "FIN DEL JUEGO",
    next: "Siguiente →",
    success: (n) => `¡Descifrado! / ${n} movimientos`,
    failure: "Fallido",
    result: "Resultado",
    youWin: "¡Ganaste!",
    youLose: "Perdiste",
    draw: "Empate",
    playAgain: "Jugar de nuevo",
    goHome: "Inicio",
    menu: "Menú",
    bgColor: "Fondo",
    bgDark: "Oscuro",
    bgLight: "Claro",
    vibration: "Vibración de turno",
    restart: "Reiniciar",
    home: "Volver al inicio",
    handoffTitle: "Pasa el teléfono",
    handoffDesc: (p) => `${p} establecerá su código. ¡No muestres la pantalla!`,
    handoffBtn: (p) => `${p}: Establecer código →`,
    adSpace: "Publicidad",
    language: "Idioma",
    unlock: "Desbloquear versión completa",
    unlockDesc: "12 colores, 8 dígitos, 30 intentos, duplicados & sin anuncios",
    unlockBtn: "Desbloquear",
    unlockCancel: "Cancelar",
    howToPlay: "Cómo jugar",
    howToPlayTitle: "Cómo jugar",
    howToPlayClose: "Cerrar",
    rules: [
      { title: "Objetivo", desc: "¡Descifra el código de colores oculto en el número de intentos permitido!" },
      { title: "Elegir", desc: "Selecciona un color y colócalo en una ranura." },
      { title: "Enviar", desc: "Toca Enviar para obtener retroalimentación." },
      { title: "Clavija roja", desc: "¡Color Y posición correctos!" },
      { title: "Clavija blanca", desc: "Color correcto pero posición incorrecta." },
      { title: "2J Batalla", desc: "Cada jugador define un código. ¡Gana quien use menos intentos!" },
      { title: "2J vs CPU", desc: "El CPU define un código. Por turnos, ¡el primero en descifrar gana!" },
    ],
    unlockPrice: "2,99 €",
    unlocked: "Desbloqueado",
    premiumBadge: "PRO",
    freeLimit: "Limitado en versión gratuita",
  },
  pt: {
    title: "Color Decode",
    subtitle: "— DECIFRE O CÓDIGO DE CORES —",
    mode: "Modo",
    mode1p: "Modo 1J",
    mode2p: "Modo 2J",
    mode2pVs: "CPU define o código",
    mode2pVsDesc: "Quem decifrar primeiro vence",
    mode2pBattle: "Jogadores definem seus códigos",
    colors: "Cores",
    codeLength: "Comprimento do código",
    maxGuesses: "Tentativas máx.",
    allowDuplicates: "Permitir repetições",
    start: "Iniciar",
    player1: "Jogador 1",
    player2: "Jogador 2",
    setCode: "Defina seu código",
    nodup: "Sem repetições",
    hiddenWarning: "Não deixe seu adversário ver a tela!",
    confirm: "Confirmar →",
    check: "Revelar",
    hide: "Ocultar",
    remaining: (n) => `${n} tentativas restantes`,
    clear: "Limpar",
    submit: "Enviar →",
    yourTurn: "◀ Sua vez",
    waiting: "Aguardando adversário…",
    turn: (n) => `TURNO ${n}`,
    gameOver: "FIM DE JOGO",
    next: "Próximo →",
    success: (n) => `Decifrado! / ${n} jogadas`,
    failure: "Falhou",
    result: "Resultado",
    youWin: "Você ganhou!",
    youLose: "Você perdeu",
    draw: "Empate",
    playAgain: "Jogar novamente",
    goHome: "Início",
    menu: "Menu",
    bgColor: "Fundo",
    bgDark: "Escuro",
    bgLight: "Claro",
    vibration: "Vibração de turno",
    restart: "Reiniciar",
    home: "Voltar ao início",
    handoffTitle: "Passe o celular",
    handoffDesc: (p) => `${p} vai definir seu código. Não mostre a tela!`,
    handoffBtn: (p) => `${p}: Definir código →`,
    adSpace: "Publicidade",
    language: "Idioma",
    unlock: "Desbloquear versão completa",
    unlockDesc: "12 cores, 8 dígitos, 30 tentativas, repetições & sem anúncios",
    unlockBtn: "Desbloquear",
    unlockCancel: "Cancelar",
    unlockPrice: "R$ 14,90",
    unlocked: "Desbloqueado",
    premiumBadge: "PRO",
    freeLimit: "Limitado na versão gratuita",
  },
  id: {
    title: "Color Decode",
    subtitle: "— PECAHKAN KODE WARNA —",
    mode: "Mode",
    mode1p: "Mode 1P",
    mode2p: "Mode 2P",
    mode2pVs: "CPU menentukan kode",
    mode2pVsDesc: "Yang pertama memecahkan kode menang",
    mode2pBattle: "Pemain menentukan kode masing-masing",
    colors: "Warna",
    codeLength: "Panjang kode",
    maxGuesses: "Maks. tebakan",
    allowDuplicates: "Izinkan duplikat",
    start: "Mulai",
    player1: "Pemain 1",
    player2: "Pemain 2",
    setCode: "Atur kode Anda",
    nodup: "Tanpa duplikat",
    hiddenWarning: "Jangan biarkan lawan melihat layar!",
    confirm: "Konfirmasi →",
    check: "Tampilkan",
    hide: "Sembunyikan",
    remaining: (n) => `Sisa ${n} tebakan`,
    clear: "Hapus",
    submit: "Kirim →",
    yourTurn: "◀ Giliran Anda",
    waiting: "Menunggu lawan…",
    turn: (n) => `GILIRAN ${n}`,
    gameOver: "PERMAINAN SELESAI",
    next: "Selanjutnya →",
    success: (n) => `Berhasil! / ${n} langkah`,
    failure: "Gagal",
    result: "Hasil",
    youWin: "Anda Menang!",
    youLose: "Anda Kalah",
    draw: "Seri",
    playAgain: "Main Lagi",
    goHome: "Beranda",
    menu: "Menu",
    bgColor: "Latar Belakang",
    bgDark: "Gelap",
    bgLight: "Terang",
    vibration: "Getaran Giliran",
    restart: "Mulai Ulang",
    home: "Kembali ke Beranda",
    handoffTitle: "Berikan ponsel",
    handoffDesc: (p) => `${p} akan mengatur kodenya. Jangan tunjukkan layarnya!`,
    handoffBtn: (p) => `${p}: Atur Kode →`,
    adSpace: "Iklan",
    language: "Bahasa",
    unlock: "Buka versi lengkap",
    unlockDesc: "12 warna, 8 digit, 30 tebakan, duplikat & tanpa iklan",
    unlockBtn: "Buka",
    unlockCancel: "Batal",
    howToPlay: "Cara Bermain",
    howToPlayTitle: "Cara Bermain",
    howToPlayClose: "Tutup",
    rules: [
      { title: "Tujuan", desc: "Pecahkan kode warna tersembunyi dalam jumlah tebakan yang diizinkan!" },
      { title: "Pilih", desc: "Pilih warna dari palet dan tempatkan di slot." },
      { title: "Kirim", desc: "Ketuk Kirim untuk mendapatkan umpan balik." },
      { title: "Pin merah", desc: "Warna DAN posisi benar!" },
      { title: "Pin putih", desc: "Warna benar tapi posisi salah." },
      { title: "2P Pertempuran", desc: "Setiap pemain menetapkan kode. Tebakan paling sedikit menang!" },
      { title: "2P vs CPU", desc: "CPU menetapkan kode. Bergantian, yang pertama memecahkan menang!" },
    ],
    unlockPrice: "Rp 45.000",
    unlocked: "Dibuka",
    premiumBadge: "PRO",
    freeLimit: "Terbatas di versi gratis",
  },
  th: {
    title: "Color Decode",
    subtitle: "— ถอดรหัสสี —",
    mode: "โหมด",
    mode1p: "โหมด 1 คน",
    mode2p: "โหมด 2 คน",
    mode2pVs: "CPU กำหนดรหัส",
    mode2pVsDesc: "ใครถอดรหัสได้ก่อนชนะ",
    mode2pBattle: "ผู้เล่นกำหนดรหัสกัน",
    colors: "จำนวนสี",
    codeLength: "ความยาวรหัส",
    maxGuesses: "ครั้งสูงสุด",
    allowDuplicates: "อนุญาตซ้ำ",
    start: "เริ่ม",
    player1: "ผู้เล่น 1",
    player2: "ผู้เล่น 2",
    setCode: "ตั้งรหัส",
    nodup: "ไม่ซ้ำ",
    hiddenWarning: "อย่าให้คู่ต่อสู้เห็นหน้าจอ!",
    confirm: "ยืนยัน →",
    check: "เปิดเผย",
    hide: "ซ่อน",
    remaining: (n) => `เหลือ ${n} ครั้ง`,
    clear: "ล้าง",
    submit: "ส่ง →",
    yourTurn: "◀ ตาของคุณ",
    waiting: "รอคู่ต่อสู้…",
    turn: (n) => `เทิร์น ${n}`,
    gameOver: "จบเกม",
    next: "ถัดไป →",
    success: (n) => `ถอดรหัสสำเร็จ! / ${n} ครั้ง`,
    failure: "ล้มเหลว",
    result: "ผลลัพธ์",
    youWin: "คุณชนะ!",
    youLose: "คุณแพ้",
    draw: "เสมอ",
    playAgain: "เล่นอีกครั้ง",
    goHome: "หน้าหลัก",
    menu: "เมนู",
    bgColor: "พื้นหลัง",
    bgDark: "มืด",
    bgLight: "สว่าง",
    vibration: "สั่นเมื่อเปลี่ยนเทิร์น",
    restart: "เริ่มใหม่",
    home: "กลับหน้าหลัก",
    handoffTitle: "ส่งโทรศัพท์ให้อีกฝ่าย",
    handoffDesc: (p) => `${p} จะตั้งรหัส อย่าให้เห็นหน้าจอ!`,
    handoffBtn: (p) => `${p}: ตั้งรหัส →`,
    adSpace: "โฆษณา",
    language: "ภาษา",
    unlock: "ปลดล็อกเวอร์ชันเต็ม",
    unlockDesc: "12 สี, 8 หลัก, 30 ครั้ง, ซ้ำได้ & ไม่มีโฆษณา",
    unlockBtn: "ปลดล็อก",
    unlockCancel: "ยกเลิก",
    howToPlay: "วิธีเล่น",
    howToPlayTitle: "วิธีเล่น",
    howToPlayClose: "ปิด",
    rules: [
      { title: "เป้าหมาย", desc: "ถอดรหัสสีที่ซ่อนอยู่ภายในจำนวนครั้งที่กำหนด!" },
      { title: "เลือกสี", desc: "เลือกสีจากจานสีและวางในช่อง" },
      { title: "ส่ง", desc: "แตะส่งเพื่อรับผลลัพธ์" },
      { title: "หมุดแดง", desc: "สีและตำแหน่งถูกต้อง!" },
      { title: "หมุดขาว", desc: "สีถูกแต่ตำแหน่งผิด" },
      { title: "2P แข่งขัน", desc: "แต่ละผู้เล่นตั้งรหัส ใครใช้ครั้งน้อยกว่าชนะ!" },
      { title: "2P vs CPU", desc: "CPU ตั้งรหัส สลับกันเดา ใครถอดได้ก่อนชนะ!" },
    ],
    unlockPrice: "฿89",
    unlocked: "ปลดล็อกแล้ว",
    premiumBadge: "PRO",
    freeLimit: "จำกัดในเวอร์ชันฟรี",
  },
};


const font = "'Outfit', sans-serif";
const accent = "#c8f135";

function generateCode(numColors, codeLength, allowDuplicates) {
  const pool = ALL_COLORS.slice(0, numColors);
  if (allowDuplicates) {
    return Array.from({ length: codeLength }, () => pool[Math.floor(Math.random() * pool.length)]);
  }
  return [...pool].sort(() => Math.random() - 0.5).slice(0, codeLength);
}

function evaluateGuess(guess, secret) {
  let black = 0, white = 0;
  const s = [...secret], g = [...guess];
  for (let i = 0; i < s.length; i++) {
    if (g[i]?.id === s[i]?.id) { black++; s[i] = null; g[i] = null; }
  }
  for (let i = 0; i < g.length; i++) {
    if (!g[i]) continue;
    const idx = s.findIndex(c => c?.id === g[i].id);
    if (idx !== -1) { white++; s[idx] = null; }
  }
  return { black, white };
}

function FeedbackPegs({ black, white, total }) {
  const pegs = Array.from({ length: total }, (_, i) =>
    i < black ? "black" : i < black + white ? "white" : "empty"
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.ceil(total / 2)}, 10px)`, gap: 3 }}>
      {pegs.map((t, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: "50%",
          background: t === "black" ? "#ef4444" : t === "white" ? "#f5f5f5" : "transparent",
          border: t === "empty" ? "1.5px solid #444" : t === "white" ? "1.5px solid #ccc" : "none",
          boxShadow: t !== "empty" ? "0 1px 3px rgba(0,0,0,.5)" : "none",
        }} />
      ))}
    </div>
  );
}

function ColorHole({ color, size = 32, onClick, muted }) {
  const isEmpty = !color || !color.bg;
  const stripedBg = color?.stripe
    ? `repeating-linear-gradient(45deg, ${color.bg} 0px, ${color.bg} 5px, rgba(255,255,255,0.6) 5px, rgba(255,255,255,0.6) 8px)`
    : color?.bg ?? "rgba(255,255,255,0.04)";
  return (
    <div onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      cursor: onClick ? "pointer" : "default",
      opacity: muted ? 0.28 : 1,
      transition: "transform .12s",
      background: isEmpty ? "rgba(255,255,255,0.04)" : stripedBg,
      border: isEmpty ? "2px dashed #383838" : "2px solid rgba(255,255,255,0.2)",
      boxShadow: isEmpty ? "none" : `0 2px 10px ${color?.bg}55`,
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = "scale(1.14)"; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.transform = "scale(1)"; }}
    />
  );
}

function GuessRow({ guess, feedback, codeLength, isCurrent, onSlotClick, rowNum }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "5px 8px", borderRadius: 8,
      background: isCurrent ? "rgba(200,241,53,0.06)" : "transparent",
      border: isCurrent ? "1px solid rgba(200,241,53,0.2)" : "1px solid transparent",
    }}>
      <span style={{ color: "#3a3a3a", fontSize: 10, width: 16, textAlign: "right", fontFamily: font }}>{rowNum}</span>
      <div style={{ display: "flex", gap: 5 }}>
        {Array.from({ length: codeLength }, (_, i) => (
          <ColorHole key={i} color={guess[i] || null} size={28}
            onClick={isCurrent && onSlotClick ? () => onSlotClick(i) : undefined}
            muted={!isCurrent && !feedback} />
        ))}
      </div>
      <div style={{ marginLeft: 3 }}>
        {feedback ? <FeedbackPegs black={feedback.black} white={feedback.white} total={codeLength} /> : <div style={{ width: 30 }} />}
      </div>
    </div>
  );
}

function ColorPalette({ colors, onSelect, selected }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
      {colors.map(c => {
        const isSelected = selected?.id === c.id;
        const stripedBg = c.stripe
          ? `repeating-linear-gradient(45deg, ${c.bg} 0px, ${c.bg} 5px, rgba(255,255,255,0.6) 5px, rgba(255,255,255,0.6) 8px)`
          : c.bg;
        return (
          <div key={c.id} onClick={() => onSelect(c)} style={{
            width: 34, height: 34, borderRadius: "50%",
            background: stripedBg, cursor: "pointer", flexShrink: 0,
            border: isSelected ? "3px solid #fff" : "3px solid transparent",
            boxShadow: isSelected ? `0 0 14px ${c.bg}` : `0 2px 8px ${c.bg}55`,
            transition: "transform .1s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
        );
      })}
    </div>
  );
}

function Slider({ label, val, set, min, max, freeLabel }) {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#666", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font }}>{label}</span>
          <span style={{ color: accent, fontWeight: 700, fontSize: 11, fontFamily: font }}>{val}</span>
        </div>
        {freeLabel && <span style={{ color: accent, fontSize: 9, fontFamily: font, opacity: 0.8 }}>{freeLabel}</span>}
      </div>
      <input type="range" min={min} max={max} value={val} onChange={e => set(Number(e.target.value))}
        style={{ width: "100%", accentColor: accent, margin: "2px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", color: "#3a3a3a", fontSize: 10, fontFamily: font }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 320 }}>
      <span style={{ color: "#666", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font }}>{label}</span>
      <div onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, cursor: "pointer",
        background: value ? accent : "#252525",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative", transition: "background .2s",
      }}>
        <div style={{
          position: "absolute", top: 3, left: value ? 22 : 3,
          width: 16, height: 16, borderRadius: "50%",
          background: value ? "#111" : "#555", transition: "left .2s",
        }} />
      </div>
    </div>
  );
}

// ── Neon Title ───────────────────────────────────────────────────────────────
function NeonTitle({ t }) {
  const title = "Color Decode"; // title is always English for the logo
  const letters = title.split("");
  const [litState, setLitState] = useState(Array(letters.length).fill("off")); // off | flicker | on
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Shuffle order of letter indices
    const order = [...Array(letters.length).keys()].sort(() => Math.random() - 0.5);
    let i = 0;
    const flicker = (idx) => {
      // Phase 1: rapid random flicker (unstable)
      let count = 0;
      const totalFlickers = Math.floor(Math.random() * 4) + 5; // 5-8 flickers
      const iv = setInterval(() => {
        const interval = count < totalFlickers - 2
          ? Math.random() * 30 + 15   // fast chaotic flicker
          : Math.random() * 60 + 40;  // slowing down before locking on
        setLitState(prev => { const next = [...prev]; next[idx] = count % 2 === 0 ? "flicker" : "off"; return next; });
        count++;
        if (count >= totalFlickers) {
          clearInterval(iv);
          // Phase 2: lock on with full glow
          setLitState(prev => { const next = [...prev]; next[idx] = "on"; return next; });
          i++;
          if (i < order.length) {
            setTimeout(() => flicker(order[i]), Math.random() * 20 + 10);
          } else {
            setDone(true);
          }
        }
      }, 25);
    };
    const t = setTimeout(() => flicker(order[0]), 50);
    return () => clearTimeout(t);
  }, []);

  const glowStyle = {
    color: "#c8f135",
    textShadow: `0 0 6px #c8f135, 0 0 18px #c8f135, 0 0 40px #c8f13599, 0 0 80px #c8f13544`,
  };
  const flickerStyle = {
    color: "rgba(200,241,53,0.7)",
    textShadow: `0 0 4px #c8f135, 0 0 10px #c8f13599`,
  };
  const dimStyle = {
    color: "rgba(200,241,53,0.08)",
    textShadow: "none",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {letters.map((l, i) => {
          if (l === " ") return <span key={i} style={{ display: "inline-block", width: "0.35em" }} />;
          const s = litState[i];
          const style = s === "on" ? glowStyle : s === "flicker" ? flickerStyle : dimStyle;
          return <span key={i} style={{ transition: "none", ...style }}>{l}</span>;
        })}
      </h1>
      <p style={{
        margin: "6px 0 0", fontSize: 10, fontFamily: font,
        letterSpacing: ".3em", textTransform: "uppercase",
        color: done ? "#c8f13588" : "transparent",
        textShadow: done ? "0 0 8px #c8f13566" : "none",
        transition: "color 0.6s, text-shadow 0.6s",
      }}>— CRACK THE COLOR CODE —</p>
    </div>
  );
}

// ── Banner Ad Placeholder ─────────────────────────────────────────────────────
function BannerAd({ darkMode, t }) {
  return (
    <div style={{
      width: "100%", height: 50,
      background: darkMode ? "#1a1a1a" : "#f0ede6",
      borderTop: `1px solid ${darkMode ? "#2a2a2a" : "#ddd"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: font, fontSize: 10, color: darkMode ? "#333" : "#bbb",
        letterSpacing: ".1em", textTransform: "uppercase",
      }}>広告スペース</span>
    </div>
  );
}


// ── How To Play Modal ────────────────────────────────────────────────────────
function HowToPlayModal({ t, darkMode, onClose }) {
  const bg = darkMode ? "#1a1a1a" : "#fff";
  const textColor = darkMode ? "#f5f1e8" : "#111";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: bg, borderRadius: 20, padding: "24px 20px",
        width: "100%", maxWidth: 360,
        border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        maxHeight: "80vh", overflowY: "auto",
      }}>
        <h2 style={{ margin: "0 0 16px", fontFamily: "'DM Serif Display', serif", color: textColor, fontSize: 22 }}>
          {t.howToPlayTitle}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {t.rules.map((rule, i) => (
            <div key={i} style={{ background: cardBg, borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ margin: "0 0 3px", fontFamily: font, fontWeight: 700, fontSize: 13, color: accent }}>{rule.title}</p>
              <p style={{ margin: 0, fontFamily: font, fontSize: 12, color: darkMode ? "#888" : "#666", lineHeight: 1.5 }}>{rule.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{
          width: "100%", padding: "12px 0", borderRadius: 50,
          background: accent, color: "#111", border: "none",
          fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font,
          boxShadow: `0 4px 20px ${accent}44`,
        }}>{t.howToPlayClose}</button>
      </div>
    </div>
  );
}

// ── Unlock Modal ──────────────────────────────────────────────────────────────
function UnlockModal({ t, darkMode, onUnlock, onClose }) {
  const bg = darkMode ? "#1a1a1a" : "#fff";
  const textColor = darkMode ? "#f5f1e8" : "#111";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: bg, borderRadius: 20, padding: "28px 24px",
        width: "100%", maxWidth: 340, textAlign: "center",
        border: `1px solid ${darkMode ? "rgba(200,241,53,0.2)" : "rgba(0,0,0,0.1)"}`,
        boxShadow: darkMode ? `0 0 40px rgba(200,241,53,0.1)` : "0 8px 40px rgba(0,0,0,0.15)",
      }}>
        <div style={{
          display: "inline-block", background: accent, color: "#111",
          fontSize: 11, fontWeight: 800, letterSpacing: ".1em",
          padding: "4px 14px", borderRadius: 20, marginBottom: 14, fontFamily: font,
        }}>{t.premiumBadge}</div>
        <h2 style={{ margin: "0 0 8px", fontFamily: "'DM Serif Display', serif", color: textColor, fontSize: 22 }}>
          {t.unlock}
        </h2>
        <p style={{ margin: "0 0 20px", color: darkMode ? "#666" : "#888", fontSize: 13, fontFamily: font, lineHeight: 1.6 }}>
          {t.unlockDesc}
        </p>
        <div style={{ display: "flex", flex: "column", gap: 10, flexDirection: "column" }}>
          <button onClick={onUnlock} style={{
            padding: "13px 0", borderRadius: 50, background: accent, color: "#111",
            border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: font,
            boxShadow: `0 4px 20px ${accent}44`, width: "100%",
          }}>{t.unlockBtn} — {t.unlockPrice}</button>
          <button onClick={onClose} style={{
            padding: "10px 0", borderRadius: 50, background: "none",
            border: `1px solid ${darkMode ? "#333" : "#ddd"}`,
            color: darkMode ? "#555" : "#999", fontSize: 13, cursor: "pointer", fontFamily: font, width: "100%",
          }}>{t.unlockCancel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsScreen({ onStart, darkMode, setDarkMode, lang, setLang, t, isPro, onShowUnlock, onShowHowToPlay }) {
  const [mode, setMode] = useState("single");
  const [numColors, setNumColors] = useState(6);
  const [codeLength, setCodeLength] = useState(4);
  const [maxGuesses, setMaxGuesses] = useState(10);
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 20px" }}>
      <div style={{ textAlign: "center" }}>
        <NeonTitle t={t} />
      </div>

      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ color: "#666", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font, marginBottom: 7 }}>{t.mode}</div>
        {/* Row 1: 1Pモード / 2Pモード */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[["single", t.mode1p], ["two", t.mode2p]].map(([id, label]) => {
            const active = id === "single" ? mode === "single" : (mode === "two" || mode === "two-vs");
            return (
              <button key={id} onClick={() => setMode(id === "single" ? "single" : "two")} style={{
                flex: 1, padding: "10px 0", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                background: active ? accent : "rgba(255,255,255,0.03)",
                color: active ? "#111" : "#666",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font, transition: "all .15s",
              }}>{label}</button>
            );
          })}
        </div>
        {/* 2P description */}
        {(mode === "two" || mode === "two-vs") && (
          <p style={{ margin: "-4px 0 4px", color: darkMode ? accent : "#888", fontSize: 10, fontFamily: font, textAlign: "center" }}>
            {t.mode2pVsDesc}
          </p>
        )}
        {/* Row 2: 2Pサブモード（2Pモード選択時のみ） */}
        {(mode === "two" || mode === "two-vs") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[["two", t.mode2pBattle], ["two-vs", t.mode2pVs]].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)} style={{
                  flex: 1, padding: "8px 6px", borderRadius: 8,
                  border: `1px solid ${mode === id ? accent+"88" : "rgba(255,255,255,0.06)"}`,
                  background: mode === id ? "rgba(200,241,53,0.12)" : "rgba(255,255,255,0.02)",
                  color: mode === id ? accent : "#555",
                  fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: font, transition: "all .15s",
                }}>{label}</button>
              ))}
            </div>

          </div>
        )}
      </div>

      <Slider label={t.colors} val={Math.min(numColors, isPro ? 12 : 6)} set={(v) => { if (!isPro && v > 6) { onShowUnlock(); return; } setNumColors(v); }} min={4} max={12} freeLabel={!isPro ? "FREE 〜6" : null} />
      <Slider label={t.codeLength} val={Math.min(codeLength, isPro ? 8 : 4)} set={(v) => { if (!isPro && v > 4) { onShowUnlock(); return; } setCodeLength(v); }} min={3} max={8} freeLabel={!isPro ? "FREE 〜4" : null} />
      <Slider label={t.maxGuesses} val={Math.min(maxGuesses, isPro ? 30 : 10)} set={(v) => { if (!isPro && v > 10) { onShowUnlock(); return; } setMaxGuesses(v); }} min={6} max={30} freeLabel={!isPro ? "FREE 〜10" : null} />
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#666", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font }}>{t.allowDuplicates}</span>
            {!isPro && <span style={{ color: accent, fontSize: 9, fontFamily: font, opacity: 0.8 }}>FREE: OFF</span>}
          </div>
          <div onClick={() => { if (!isPro) { onShowUnlock(); return; } setAllowDuplicates(v => !v); }} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer",
            background: (isPro && allowDuplicates) ? accent : "#252525",
            border: "1px solid rgba(255,255,255,0.08)",
            position: "relative", transition: "background .2s",
            opacity: isPro ? 1 : 0.5,
          }}>
            <div style={{
              position: "absolute", top: 3, left: (isPro && allowDuplicates) ? 22 : 3,
              width: 16, height: 16, borderRadius: "50%",
              background: (isPro && allowDuplicates) ? "#111" : "#555", transition: "left .2s",
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 5 }}>
        {ALL_COLORS.slice(0, numColors).map(c => (
          <div key={c.id} style={{
            width: 14, height: 14, borderRadius: "50%",
            background: c.stripe
              ? `repeating-linear-gradient(45deg, ${c.bg} 0px, ${c.bg} 5px, rgba(255,255,255,0.6) 5px, rgba(255,255,255,0.6) 8px)`
              : c.bg,
            boxShadow: `0 2px 8px ${c.bg}66`,
          }} />
        ))}
      </div>

      {/* Language selector */}
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ color: "#666", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font, marginBottom: 7 }}>{t.language}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)} style={{
              padding: "4px 8px", borderRadius: 8, fontSize: 10, fontFamily: font, fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", transition: "all .15s",
              background: lang === l.code ? accent : "rgba(255,255,255,0.03)",
              color: lang === l.code ? "#111" : "#666",
            }}>{l.label}</button>
          ))}
        </div>
      </div>

      {/* Background toggle */}
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ color: "#666", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: font, marginBottom: 7 }}>{t.bgColor}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[[t.bgDark, true], [t.bgLight, false]].map(([label, val]) => (
            <button key={label} onClick={() => setDarkMode(val)} style={{
              flex: 1, padding: "6px 0", borderRadius: 8, fontSize: 11, fontFamily: font,
              fontWeight: 600, cursor: "pointer",
              background: darkMode === val ? accent : "rgba(255,255,255,0.03)",
              color: darkMode === val ? "#111" : "#666",
              border: "1px solid rgba(255,255,255,0.08)", transition: "all .15s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 320 }}>
        <button onClick={onShowHowToPlay} style={{
          flex: 1, padding: "8px 0", borderRadius: 50, background: "none",
          border: `1px solid ${darkMode ? "#2a2a2a" : "#ddd"}`,
          color: darkMode ? "#666" : "#888",
          fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font,
        }}>{t.howToPlay}</button>

        {!isPro && (
          <button onClick={onShowUnlock} style={{
            flex: 1, padding: "8px 0", borderRadius: 50, background: "none",
            border: `1px solid ${accent}88`, color: accent,
            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font,
          }}>{t.unlock}</button>
        )}
        {isPro && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ background: accent, color: "#111", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 20, fontFamily: font }}>{t.premiumBadge}</span>
            <span style={{ color: "#555", fontSize: 11, fontFamily: font }}>{t.unlocked}</span>
          </div>
        )}
      </div>

      <button onClick={() => onStart({ mode, numColors: Math.min(numColors, isPro ? 12 : 6), codeLength: Math.min(codeLength, isPro ? 8 : 4), maxGuesses: Math.min(maxGuesses, isPro ? 30 : 10), allowDuplicates })} style={{
        marginTop: 4, padding: "13px 50px", borderRadius: 50,
        background: accent, color: "#111", border: "none",
        fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font,
        letterSpacing: ".5px", boxShadow: `0 4px 24px ${accent}44`, transition: "transform .1s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >{t.start}</button>
    </div>
  );
}

// ── Handoff popup ─────────────────────────────────────────────────────────────
function HandoffPopup({ nextPlayer, onContinue, t }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 20, padding: "36px 32px", maxWidth: 320, width: "90%",
        textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
      }}>
        
        <h2 style={{ margin: "0 0 8px", fontFamily: "'DM Serif Display', serif", color: "#f5f1e8", fontSize: 22 }}>
          {t.handoffTitle}
        </h2>
        <p style={{ margin: "0 0 24px", color: "#666", fontSize: 13, fontFamily: font, lineHeight: 1.6 }}>
          {t.handoffDesc(nextPlayer)}
        </p>
        <button onClick={onContinue} style={{
          padding: "12px 32px", borderRadius: 50, background: accent, color: "#111",
          border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font,
          boxShadow: `0 4px 20px ${accent}44`, width: "100%",
        }}>
          {t.handoffBtn(nextPlayer)}
        </button>
      </div>
    </div>
  );
}

// ── Code Setup (2P) ───────────────────────────────────────────────────────────
function CodeSetupScreen({ player, config, onDone, flipped, t }) {
  const colors = ALL_COLORS.slice(0, config.numColors);
  const [code, setCode] = useState(Array(config.codeLength).fill(null));
  const [selected, setSelected] = useState(colors[0]);
  const [revealed, setRevealed] = useState(false);

  // Reset when player changes
  useEffect(() => {
    setCode(Array(config.codeLength).fill(null));
    setSelected(colors[0]);
    setRevealed(false);
  }, [player]);

  const handleSlot = (i) => {
    if (!config.allowDuplicates && code.some((c, j) => j !== i && c?.id === selected.id)) return;
    const next = [...code]; next[i] = selected; setCode(next);
  };

  return (
    <div style={{ transform: flipped ? "rotate(180deg)" : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "20px 16px" }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ margin: 0, color: "#f5f1e8", fontSize: 26, fontFamily: "'DM Serif Display', serif" }}>{player}</h2>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 12, fontFamily: font }}>コードを設定</p>
        <p style={{ margin: "6px 0 0", color: "#555", fontSize: 11, fontFamily: font }}>{t.hiddenWarning}</p>
        {!config.allowDuplicates && <p style={{ margin: "2px 0 0", color: "#444", fontSize: 9, fontFamily: font }}>同色なし</p>}
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        {code.map((c, i) => (
          <ColorHole key={i} color={revealed ? c : (c ? { bg: "#2a2a2a" } : null)} onClick={() => handleSlot(i)} size={36} />
        ))}
      </div>
      <button onClick={() => setRevealed(r => !r)} style={{
        background: "none", border: "1px solid #2e2e2e", color: "#555",
        padding: "4px 12px", borderRadius: 20, fontSize: 10, cursor: "pointer", fontFamily: font,
      }}>{revealed ? t.hide : t.check}</button>
      <ColorPalette colors={colors} onSelect={setSelected} selected={selected} />
      {code.every(Boolean) && (
        <button onClick={() => onDone(code)} style={{
          padding: "9px 32px", borderRadius: 50, background: accent, color: "#111",
          border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: font,
          boxShadow: `0 3px 14px ${accent}44`,
        }}>{t.confirm}</button>
      )}
    </div>
  );
}

// ── Single player board ───────────────────────────────────────────────────────
function SingleBoard({ config, onEnd, darkMode, t, isPro }) {
  const secret = useRef(generateCode(config.numColors, config.codeLength, config.allowDuplicates)).current;
  const colors = ALL_COLORS.slice(0, config.numColors);
  const [rows, setRows] = useState([Array(config.codeLength).fill(null)]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(colors[0]);
  const [status, setStatus] = useState("playing");
  const [showSecret, setShowSecret] = useState(false);
  const listRef = useRef(null);
  useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [rows]);

  const cur = rows.length - 1;
  const currentGuess = rows[cur];
  const ready = currentGuess.every(Boolean);

  const handleSlot = (i) => {
    if (status !== "playing") return;
    const next = [...rows]; next[cur] = [...next[cur]];
    // Clear previous position of same color (move instead of duplicate)
    const prevIdx = next[cur].findIndex((c, j) => j !== i && c?.id === selected.id);
    if (prevIdx !== -1) next[cur][prevIdx] = null;
    if (!config.allowDuplicates && prevIdx === -1 && next[cur].some((c, j) => j !== i && c?.id === selected.id)) return;
    next[cur][i] = selected; setRows(next);
  };

  const handleSubmit = () => {
    if (!ready || status !== "playing") return;
    const fb = evaluateGuess(currentGuess, secret);
    const nf = [...feedbacks, fb];
    setFeedbacks(nf);
    if (fb.black === config.codeLength) { setStatus("won"); setShowSecret(true); }
    else if (rows.length >= config.maxGuesses) { setStatus("lost"); setShowSecret(true); }
    else setRows([...rows, Array(config.codeLength).fill(null)]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 16px 8px" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#555", fontSize: 10, margin: 0, letterSpacing: ".1em", fontFamily: font }}>{t.remaining(config.maxGuesses - feedbacks.length)}</p>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 5 }}>
          {secret.map((c, i) => <ColorHole key={i} color={showSecret ? c : { bg: "#1c1c1c" }} size={24} />)}
        </div>
      </div>
      <div ref={listRef} style={{ maxHeight: 340, overflowY: "auto", width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
        {rows.map((g, i) => (
          <GuessRow key={i} guess={g} feedback={feedbacks[i]} codeLength={config.codeLength}
            isCurrent={i === cur && status === "playing"} onSlotClick={handleSlot} rowNum={i + 1} />
        ))}
      </div>
      {status === "playing" ? (
        <>
          <ColorPalette colors={colors} onSelect={setSelected} selected={selected} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { const n=[...rows]; n[cur]=Array(config.codeLength).fill(null); setRows(n); }}
              style={{ padding: "8px 16px", borderRadius: 50, background: "none", border: "1px solid #2e2e2e", color: "#555", fontSize: 11, cursor: "pointer", fontFamily: font }}>{t.clear}</button>
            <button onClick={handleSubmit} disabled={!ready} style={{
              padding: "8px 22px", borderRadius: 50,
              background: ready ? accent : "#1e1e1e", color: ready ? "#111" : "#3a3a3a",
              border: "none", fontSize: 11, fontWeight: 800, cursor: ready ? "pointer" : "not-allowed", fontFamily: font,
              boxShadow: ready ? `0 3px 14px ${accent}44` : "none", transition: "all .15s",
            }}>{t.submit}</button>
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "10px 20px", borderRadius: 10, textAlign: "center", fontFamily: font,
            background: status === "won" ? "rgba(200,241,53,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${status === "won" ? accent+"44" : "#ef444444"}`,
            color: status === "won" ? accent : "#ef4444", fontSize: 14, fontWeight: 700,
          }}>
            {status === "won" ? `解除成功 / ${feedbacks.length}手` : "解除失敗"}
          </div>
          <button onClick={() => onEnd(status, feedbacks.length)} style={{
            padding: "10px 32px", borderRadius: 50, background: accent, color: "#111",
            border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: font,
            boxShadow: `0 3px 14px ${accent}44`,
          }}>次へ →</button>
        </div>
      )}
      {!isPro && <BannerAd darkMode={darkMode} t={t} />}
    </div>
  );
}

// ── Two-Player split screen ───────────────────────────────────────────────────
function TwoPlayerBoard({ config, p1Secret, p2Secret, onEnd, darkMode, vibration, onMenuOpen, t }) {
  const colors = ALL_COLORS.slice(0, config.numColors);
  const emptyRow = () => Array(config.codeLength).fill(null);
  const initBoard = () => ({ rows: [emptyRow()], feedbacks: [], status: "playing" });

  // Single unified state to avoid stale closures
  const [state, setState] = useState({
    p1: initBoard(),
    p2: initBoard(),
    turn: 1,       // 1 = P1's turn, 2 = P2's turn
    sel1: colors[0],
    sel2: colors[0],
    gameOver: false,
    showSecrets: false,
  });

  const ref1 = useRef(null), ref2 = useRef(null);
  useEffect(() => { if (ref1.current) ref1.current.scrollTop = ref1.current.scrollHeight; }, [state.p1.rows]);
  useEffect(() => { if (ref2.current) ref2.current.scrollTop = ref2.current.scrollHeight; }, [state.p2.rows]);

  // onEnd called manually via "次へ" button

  const handleSelect = (player, color) => {
    setState(s => player === 1 ? { ...s, sel1: color } : { ...s, sel2: color });
  };

  const handleSlot = (player, slotIdx) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const sel = player === 1 ? s.sel1 : s.sel2;
      if (board.status !== "playing") return s;
      const cur = board.rows.length - 1;
      const currentRow = board.rows[cur];
      const prevIdx = currentRow.findIndex((c, j) => j !== slotIdx && c?.id === sel.id);
      if (!config.allowDuplicates && prevIdx === -1 && currentRow.some((c, j) => j !== slotIdx && c?.id === sel.id)) return s;
      const newRows = board.rows.map((r, ri) => {
        if (ri !== cur) return r;
        return r.map((c, ci) => {
          if (ci === slotIdx) return sel;
          if (ci === prevIdx) return null;
          return c;
        });
      });
      const newBoard = { ...board, rows: newRows };
      return player === 1 ? { ...s, p1: newBoard } : { ...s, p2: newBoard };
    });
  };

  const handleClear = (player) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const cur = board.rows.length - 1;
      const newRows = board.rows.map((r, ri) => ri === cur ? emptyRow() : r);
      const newBoard = { ...board, rows: newRows };
      return player === 1 ? { ...s, p1: newBoard } : { ...s, p2: newBoard };
    });
  };

  const handleSubmit = (player) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const otherBoard = player === 1 ? s.p2 : s.p1;
      const secret = player === 1 ? p2Secret : p1Secret;
      const cur = board.rows.length - 1;
      const guess = board.rows[cur];
      if (!guess.every(Boolean) || board.status !== "playing") return s;

      const fb = evaluateGuess(guess, secret);
      const newFeedbacks = [...board.feedbacks, fb];
      let newStatus = board.status;
      let newRows = board.rows;

      if (fb.black === config.codeLength) newStatus = "won";
      else if (board.rows.length >= config.maxGuesses) newStatus = "lost";
      else newRows = [...board.rows, emptyRow()];

      const newBoard = { rows: newRows, feedbacks: newFeedbacks, status: newStatus };
      const thisDone = newStatus !== "playing";
      const otherDone = otherBoard.status !== "playing";

      // Game over only when BOTH players have finished the SAME turn
      // i.e. this player just finished AND the other is already done (or vice versa,
      // but we enforce same-turn by only ending when the 2nd of the pair finishes).
      // Turn order: P1 always goes first each round, then P2.
      // So gameOver when P2 submits and P1 is already done, OR P1 submits and P2 is already done.
      const gameOver = thisDone && otherDone;

      // Next player's current row cleared, color reset
      const nextPlayer = player === 1 ? 2 : 1;
      const otherCur = otherBoard.rows.length - 1;
      const clearedOtherRows = otherBoard.rows.map((r, ri) => ri === otherCur ? emptyRow() : r);
      const clearedOtherBoard = { ...otherBoard, rows: clearedOtherRows };

      const newState = {
        ...s,
        p1: player === 1 ? newBoard : (gameOver ? otherBoard : clearedOtherBoard),
        p2: player === 2 ? newBoard : (gameOver ? otherBoard : clearedOtherBoard),
        sel1: player === 1 ? s.sel1 : colors[0],
        sel2: player === 2 ? s.sel2 : colors[0],
        turn: gameOver ? s.turn : nextPlayer,
        gameOver,
        showSecrets: gameOver,
      };
      if (!gameOver && vibration && navigator.vibrate) navigator.vibrate(80);
      return newState;
    });
  };

  const renderPanel = ({ player, board, sel, secret, label, flipped, listRef: lr }) => {
    const canAct = state.turn === player && board.status === "playing" && !state.gameOver;
    const cur = board.rows.length - 1;
    const ready = board.rows[cur]?.every(Boolean);

    const inactiveColor = darkMode ? "#3a3a3a" : "#bbb";
    const activeBg = darkMode ? "rgba(200,241,53,0.07)" : "rgba(220,30,30,0.07)";
    const activeTextColor = darkMode ? accent : "#cc2020";
    const secretHoleBg = darkMode ? "#1a1a1a" : "#ddd";
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "10px 12px 12px",
        transform: flipped ? "rotate(180deg)" : "none",
        background: canAct ? activeBg : "transparent",
        transition: "background .3s",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: canAct ? activeTextColor : inactiveColor, fontSize: 10, letterSpacing: ".1em", fontFamily: font, transition: "color .3s" }}>
            {label}{canAct ? ` ${t.yourTurn}` : ""}
          </p>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 4 }}>
            {secret.map((c, i) => <ColorHole key={i} color={state.showSecrets ? c : { bg: secretHoleBg }} size={20} />)}
          </div>
        </div>

        <div ref={lr} style={{ maxHeight: 190, overflowY: "auto", width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
          {board.rows.map((g, i) => (
            <GuessRow key={i} guess={g} feedback={board.feedbacks[i]} codeLength={config.codeLength}
              isCurrent={i === cur && canAct}
              onSlotClick={canAct ? (si) => handleSlot(player, si) : undefined}
              rowNum={i + 1} />
          ))}
        </div>

        {board.status !== "playing" && (
          <div style={{
            padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: font,
            background: board.status === "won" ? "rgba(200,241,53,0.12)" : "rgba(239,68,68,0.1)",
            color: board.status === "won" ? accent : "#ef4444",
          }}>
            {board.status === "won" ? t.success(board.feedbacks.length) : t.failure}
          </div>
        )}

        {canAct && (
          <>
            <ColorPalette colors={colors} onSelect={(c) => handleSelect(player, c)} selected={sel} />
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => handleClear(player)} style={{
                padding: "6px 13px", borderRadius: 50, background: "none",
                border: "1px solid #2a2a2a", color: "#555", fontSize: 10, cursor: "pointer", fontFamily: font,
              }}>クリア</button>
              <button onClick={() => handleSubmit(player)} disabled={!ready} style={{
                padding: "6px 18px", borderRadius: 50,
                background: ready ? accent : "#1c1c1c", color: ready ? "#111" : "#3a3a3a",
                border: "none", fontSize: 10, fontWeight: 800, cursor: ready ? "pointer" : "not-allowed", fontFamily: font,
                boxShadow: ready ? `0 2px 10px ${accent}44` : "none", transition: "all .15s",
              }}>{t.submit}</button>
            </div>
          </>
        )}
        {!canAct && board.status === "playing" && !state.gameOver && (
          <p style={{ color: darkMode ? "#2e2e2e" : "#bbb", fontSize: 9, fontFamily: font, margin: 0 }}>相手のターン待ち…</p>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {renderPanel({ player: 2, board: state.p2, sel: state.sel2, secret: p1Secret, label: t.player2, flipped: true, listRef: ref2 })}
      <div style={{
        textAlign: "center", padding: "8px 0",
        background: darkMode ? "#0e0e0e" : "#e8e4dc",
        borderTop: `1px solid ${darkMode ? "#1c1c1c" : "#ccc"}`,
        borderBottom: `1px solid ${darkMode ? "#1c1c1c" : "#ccc"}`,
        position: "relative",
      }}>
        {/* Menu button centered in divider */}
        <button onClick={() => {}} id="menu-trigger" style={{ display: "none" }} />
        {state.gameOver ? (
          <button onClick={() => onEnd(
            { status: state.p1.status, moves: state.p1.feedbacks.length },
            { status: state.p2.status, moves: state.p2.feedbacks.length }
          )} style={{
            padding: "8px 28px", borderRadius: 50, background: accent, color: "#111",
            border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: font,
            boxShadow: `0 3px 14px ${accent}44`,
          }}>{t.next}</button>
        ) : (
          <span style={{ color: darkMode ? accent : "#cc2020", fontSize: 9, letterSpacing: ".15em", fontFamily: font, fontWeight: 700 }}>
            {`TURN ${state.p1.feedbacks.length + state.p2.feedbacks.length + 1}`}
          </span>
        )}
        <button onClick={onMenuOpen} style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: `1px solid ${darkMode ? "#2a2a2a" : "#bbb"}`,
          borderRadius: 6, width: 28, height: 28, cursor: "pointer",
          color: "#888", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
        }}>☰</button>
      </div>
      {renderPanel({ player: 1, board: state.p1, sel: state.sel1, secret: p2Secret, label: t.player1, flipped: false, listRef: ref1 })}
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────
function ResultScreen({ p1Result, p2Result, isSingle, onRestart, onHome, darkMode, t }) {
  // Determine winner for 2P
  let p1Outcome = null, p2Outcome = null;
  if (!isSingle && p2Result) {
    if (p1Result.status === "won" && p2Result.status === "won") {
      if (p1Result.moves < p2Result.moves)      { p1Outcome = "win"; p2Outcome = "lose"; }
      else if (p2Result.moves < p1Result.moves) { p1Outcome = "lose"; p2Outcome = "win"; }
      else                                       { p1Outcome = "draw"; p2Outcome = "draw"; }
    } else if (p1Result.status === "won")  { p1Outcome = "win";  p2Outcome = "lose"; }
    else if (p2Result.status === "won")    { p1Outcome = "lose"; p2Outcome = "win"; }
    else                                   { p1Outcome = "draw"; p2Outcome = "draw"; }
  }

  const outcomeLabel = (o) =>
    o === "win" ? "あなたの勝ち" : o === "lose" ? "あなたの負け" : "引き分け";
  const outcomeColor = (o) =>
    o === "win" ? accent : o === "lose" ? "#ef4444" : "#888";

  const textColor = darkMode ? "#f5f1e8" : "#111";
  const cardBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  const cardBorder = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "28px 20px" }}>
      <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", color: textColor, fontSize: 28 }}>{t.result}</h2>

      {!isSingle && p2Result && (
        <>
          {[[t.player1, p1Result, p1Outcome], [t.player2, p2Result, p2Outcome]].map(([name, r, o]) => (
            <div key={name} style={{ padding: "14px 24px", borderRadius: 14, textAlign: "center", width: "100%", maxWidth: 300, background: cardBg, border: `1px solid ${cardBorder}` }}>
              <p style={{ margin: 0, color: "#888", fontSize: 11, fontFamily: font }}>{name}</p>
              <p style={{ margin: "3px 0 2px", fontFamily: font, fontWeight: 800, fontSize: 15, color: r.status === "won" ? accent : "#ef4444" }}>
                {r.status === "won" ? t.success(r.moves) : t.failure}
              </p>
              <p style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: 18, color: outcomeColor(o) }}>
                {outcomeLabel(o)}
              </p>
            </div>
          ))}
        </>
      )}

      {isSingle && (
        <div style={{ padding: "16px 28px", borderRadius: 14, textAlign: "center", background: cardBg, border: `1px solid ${cardBorder}` }}>
          <p style={{ margin: 0, fontFamily: font, fontWeight: 800, fontSize: 20,
            color: p1Result.status === "won" ? accent : "#ef4444" }}>
            {p1Result.status === "won" ? `${p1Result.moves}手で正解！` : "解除失敗"}
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={onRestart} style={{
          padding: "12px 32px", borderRadius: 50, background: accent, color: "#111",
          border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: font,
          boxShadow: `0 4px 20px ${accent}44`,
        }}>{t.playAgain}</button>
        <button onClick={onHome} style={{
          padding: "12px 24px", borderRadius: 50, background: "none",
          border: `1px solid ${darkMode ? "#333" : "#ccc"}`, color: "#888",
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font,
        }}>{t.goHome}</button>
      </div>
      <BannerAd darkMode={darkMode} />
    </div>
  );
}


// ── Two Players vs CPU ────────────────────────────────────────────────────────
// CPU sets one secret. P1 and P2 alternate guesses. First to crack it wins.
function TwoVsCpuBoard({ config, onEnd, darkMode, vibration, onMenuOpen, t }) {
  const colors = ALL_COLORS.slice(0, config.numColors);
  const secret = useRef(generateCode(config.numColors, config.codeLength, config.allowDuplicates)).current;

  const emptyRow = () => Array(config.codeLength).fill(null);
  const initBoard = () => ({ rows: [emptyRow()], feedbacks: [], status: "playing" });

  const [state, setState] = useState({
    p1: initBoard(),
    p2: initBoard(),
    turn: 1,
    sel1: colors[0],
    sel2: colors[0],
    gameOver: false,
    winner: null, // 1 | 2 | "draw"
    showSecret: false,
  });

  const ref1 = useRef(null), ref2 = useRef(null);
  useEffect(() => { if (ref1.current) ref1.current.scrollTop = ref1.current.scrollHeight; }, [state.p1.rows]);
  useEffect(() => { if (ref2.current) ref2.current.scrollTop = ref2.current.scrollHeight; }, [state.p2.rows]);

  const handleSelect = (player, color) => {
    setState(s => player === 1 ? { ...s, sel1: color } : { ...s, sel2: color });
  };

  const handleSlot = (player, slotIdx) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const sel = player === 1 ? s.sel1 : s.sel2;
      if (board.status !== "playing") return s;
      const cur = board.rows.length - 1;
      const currentRow = board.rows[cur];
      const prevIdx = currentRow.findIndex((c, j) => j !== slotIdx && c?.id === sel.id);
      if (!config.allowDuplicates && prevIdx === -1 && currentRow.some((c, j) => j !== slotIdx && c?.id === sel.id)) return s;
      const newRows = board.rows.map((r, ri) => {
        if (ri !== cur) return r;
        return r.map((c, ci) => {
          if (ci === slotIdx) return sel;
          if (ci === prevIdx) return null;
          return c;
        });
      });
      return player === 1 ? { ...s, p1: { ...board, rows: newRows } } : { ...s, p2: { ...board, rows: newRows } };
    });
  };

  const handleClear = (player) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const cur = board.rows.length - 1;
      const newRows = board.rows.map((r, ri) => ri === cur ? emptyRow() : r);
      return player === 1 ? { ...s, p1: { ...board, rows: newRows } } : { ...s, p2: { ...board, rows: newRows } };
    });
  };

  const handleSubmit = (player) => {
    setState(s => {
      if (s.turn !== player || s.gameOver) return s;
      const board = player === 1 ? s.p1 : s.p2;
      const cur = board.rows.length - 1;
      const guess = board.rows[cur];
      if (!guess.every(Boolean) || board.status !== "playing") return s;

      const fb = evaluateGuess(guess, secret);
      const newFeedbacks = [...board.feedbacks, fb];
      const won = fb.black === config.codeLength;
      const outOfGuesses = board.rows.length >= config.maxGuesses;
      let newStatus = won ? "won" : outOfGuesses ? "lost" : "playing";
      let newRows = newStatus === "playing" ? [...board.rows, emptyRow()] : board.rows;
      const newBoard = { rows: newRows, feedbacks: newFeedbacks, status: newStatus };

      const gameOver = won || (outOfGuesses && (player === 1 ? s.p2.status !== "playing" : s.p1.status !== "playing"));
      const nextPlayer = player === 1 ? 2 : 1;

      // Clear next player's current row and reset color
      const otherBoard = player === 1 ? s.p2 : s.p1;
      const otherCur = otherBoard.rows.length - 1;
      const clearedOther = { ...otherBoard, rows: otherBoard.rows.map((r, ri) => ri === otherCur ? emptyRow() : r) };

      if (!gameOver && vibration && navigator.vibrate) navigator.vibrate(80);

      return {
        ...s,
        p1: player === 1 ? newBoard : (gameOver ? otherBoard : clearedOther),
        p2: player === 2 ? newBoard : (gameOver ? otherBoard : clearedOther),
        sel1: player === 1 ? s.sel1 : colors[0],
        sel2: player === 2 ? s.sel2 : colors[0],
        turn: gameOver ? s.turn : nextPlayer,
        gameOver: won || gameOver,
        winner: won ? player : gameOver ? "draw" : null,
        showSecret: won || gameOver,
      };
    });
  };

  const renderPanel = ({ player, board, sel, label, flipped, listRef: lr }) => {
    const canAct = state.turn === player && board.status === "playing" && !state.gameOver;
    const cur = board.rows.length - 1;
    const ready = board.rows[cur]?.every(Boolean);
    const inactiveColor = darkMode ? "#3a3a3a" : "#bbb";
    const activeBg = darkMode ? "rgba(200,241,53,0.07)" : "rgba(220,30,30,0.07)";
    const activeTextColor = darkMode ? accent : "#cc2020";

    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "10px 12px 12px",
        transform: flipped ? "rotate(180deg)" : "none",
        background: canAct ? activeBg : "transparent",
        transition: "background .3s",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: canAct ? activeTextColor : inactiveColor, fontSize: 10, letterSpacing: ".1em", fontFamily: font, transition: "color .3s" }}>
            {label}{canAct ? ` ${t.yourTurn}` : ""}
          </p>
          {/* shared secret */}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 4 }}>
            {secret.map((c, i) => <ColorHole key={i} color={state.showSecret ? c : { bg: darkMode ? "#1a1a1a" : "#ddd" }} size={20} />)}
          </div>
        </div>

        <div ref={lr} style={{ maxHeight: 190, overflowY: "auto", width: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
          {board.rows.map((g, i) => (
            <GuessRow key={i} guess={g} feedback={board.feedbacks[i]} codeLength={config.codeLength}
              isCurrent={i === cur && canAct}
              onSlotClick={canAct ? (si) => handleSlot(player, si) : undefined}
              rowNum={i + 1} />
          ))}
        </div>

        {board.status !== "playing" && (
          <div style={{
            padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: font,
            background: board.status === "won" ? "rgba(200,241,53,0.12)" : "rgba(239,68,68,0.1)",
            color: board.status === "won" ? accent : "#ef4444",
          }}>
            {board.status === "won" ? t.success(board.feedbacks.length) : t.failure}
          </div>
        )}

        {canAct && (
          <>
            <ColorPalette colors={colors} onSelect={(c) => handleSelect(player, c)} selected={sel} />
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => handleClear(player)} style={{
                padding: "6px 13px", borderRadius: 50, background: "none",
                border: `1px solid ${darkMode ? "#2a2a2a" : "#ccc"}`, color: "#666", fontSize: 10, cursor: "pointer", fontFamily: font,
              }}>クリア</button>
              <button onClick={() => handleSubmit(player)} disabled={!ready} style={{
                padding: "6px 18px", borderRadius: 50,
                background: ready ? accent : (darkMode ? "#1c1c1c" : "#eee"),
                color: ready ? "#111" : (darkMode ? "#3a3a3a" : "#bbb"),
                border: "none", fontSize: 10, fontWeight: 800,
                cursor: ready ? "pointer" : "not-allowed", fontFamily: font,
                boxShadow: ready ? `0 2px 10px ${accent}44` : "none", transition: "all .15s",
              }}>{t.submit}</button>
            </div>
          </>
        )}
        {!canAct && board.status === "playing" && !state.gameOver && (
          <p style={{ color: darkMode ? "#2e2e2e" : "#bbb", fontSize: 9, fontFamily: font, margin: 0 }}>{t.waiting}</p>
        )}
      </div>
    );
  };

  const dividerBg = darkMode ? "#0e0e0e" : "#e8e4dc";
  const dividerBorder = darkMode ? "#1c1c1c" : "#ccc";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {renderPanel({ player: 2, board: state.p2, sel: state.sel2, label: t.player2, flipped: true, listRef: ref2 })}
      <div style={{
        textAlign: "center", padding: "8px 0",
        background: dividerBg, borderTop: `1px solid ${dividerBorder}`, borderBottom: `1px solid ${dividerBorder}`,
        position: "relative",
      }}>
        {state.gameOver ? (
          <button onClick={() => onEnd(
            { status: state.p1.status, moves: state.p1.feedbacks.length },
            { status: state.p2.status, moves: state.p2.feedbacks.length }
          )} style={{
            padding: "8px 28px", borderRadius: 50, background: accent, color: "#111",
            border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: font,
            boxShadow: `0 3px 14px ${accent}44`,
          }}>{t.next}</button>
        ) : (
          <span style={{ color: darkMode ? accent : "#cc2020", fontSize: 9, letterSpacing: ".15em", fontFamily: font, fontWeight: 700 }}>
            {`TURN ${state.p1.feedbacks.length + state.p2.feedbacks.length + 1}`}
          </span>
        )}
        <button onClick={onMenuOpen} style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: `1px solid ${darkMode ? "#2a2a2a" : "#bbb"}`,
          borderRadius: 6, width: 28, height: 28, cursor: "pointer",
          color: "#888", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
        }}>☰</button>
      </div>
      {renderPanel({ player: 1, board: state.p1, sel: state.sel1, label: t.player1, flipped: false, listRef: ref1 })}
    </div>
  );
}

// ── Menu ─────────────────────────────────────────────────────────────────────
function MenuDrawer({ onClose, darkMode, setDarkMode, vibration, setVibration, onRestart, onHome, lang, setLang, t }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div style={{
        position: "relative", marginLeft: "auto", width: 280,
        background: darkMode ? "#1a1a1a" : "#f5f5f0",
        height: "100%", padding: "48px 24px 32px",
        display: "flex", flexDirection: "column", gap: 8,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer",
        }}>✕</button>
        <h3 style={{ margin: "0 0 16px", fontFamily: "'DM Serif Display', serif",
          color: darkMode ? "#f5f1e8" : "#111", fontSize: 20 }}>{t.menu}</h3>

        {/* Dark mode toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 0", borderBottom: `1px solid ${darkMode ? "#2a2a2a" : "#e0e0e0"}` }}>
          <span style={{ fontFamily: font, fontSize: 14, color: darkMode ? "#aaa" : "#555" }}>{t.bgColor}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[[t.bgDark, true], [t.bgLight, false]].map(([label, val]) => (
              <button key={label} onClick={() => setDarkMode(val)} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontFamily: font,
                fontWeight: 600, cursor: "pointer",
                background: darkMode === val ? accent : "transparent",
                color: darkMode === val ? "#111" : "#888",
                border: `1px solid ${darkMode === val ? accent : (darkMode ? "#333" : "#ccc")}`,
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Vibration toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 0", borderBottom: `1px solid ${darkMode ? "#2a2a2a" : "#e0e0e0"}` }}>
          <span style={{ fontFamily: font, fontSize: 14, color: darkMode ? "#aaa" : "#555" }}>{t.vibration}</span>
          <div onClick={() => setVibration(v => !v)} style={{
            width: 44, height: 24, borderRadius: 12, cursor: "pointer",
            background: vibration ? accent : (darkMode ? "#2a2a2a" : "#ccc"),
            position: "relative", transition: "background .2s",
          }}>
            <div style={{
              position: "absolute", top: 3, left: vibration ? 22 : 3,
              width: 16, height: 16, borderRadius: "50%",
              background: vibration ? "#111" : "#fff", transition: "left .2s",
            }} />
          </div>
        </div>

        {/* Language */}
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${darkMode ? "#2a2a2a" : "#e0e0e0"}` }}>
          <span style={{ fontFamily: font, fontSize: 14, color: darkMode ? "#aaa" : "#555", display: "block", marginBottom: 8 }}>{t.language}</span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={{
                padding: "4px 8px", borderRadius: 6, fontSize: 10, fontFamily: font, fontWeight: 600,
                border: `1px solid ${lang === l.code ? accent : (darkMode ? "#333" : "#ccc")}`,
                background: lang === l.code ? accent : "transparent",
                color: lang === l.code ? "#111" : "#888", cursor: "pointer",
              }}>{l.label}</button>
            ))}
          </div>
        </div>

        {/* Restart */}
        <button onClick={() => { onRestart(); onClose(); }} style={{
          marginTop: 16, padding: "12px 0", borderRadius: 10, width: "100%",
          background: "none", border: `1px solid ${darkMode ? "#333" : "#ddd"}`,
          color: darkMode ? "#aaa" : "#555", fontSize: 14, fontFamily: font,
          fontWeight: 600, cursor: "pointer",
        }}>{t.restart}</button>

        {/* Home */}
        <button onClick={() => { onHome(); onClose(); }} style={{
          padding: "12px 0", borderRadius: 10, width: "100%",
          background: "none", border: `1px solid ${darkMode ? "#333" : "#ddd"}`,
          color: darkMode ? "#aaa" : "#555", fontSize: 14, fontFamily: font,
          fontWeight: 600, cursor: "pointer",
        }}>{t.home}</button>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("settings");
  const [config, setConfig] = useState(null);
  const [setupPhase, setSetupPhase] = useState(null);
  const [p1Secret, setP1Secret] = useState(null);
  const [p2Secret, setP2Secret] = useState(null);
  const [endData, setEndData] = useState(null);
  const [showHandoff, setShowHandoff] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [lang, setLang] = useState("ja");
  const [isPro, setIsPro] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const t = T[lang];

  const handleUnlock = () => {
    // TODO: ここに実際の課金処理を追加（RevenueCat等）
    // 今はテスト用にそのまま解放
    setIsPro(true);
    setShowUnlock(false);
  };

  const goHome = () => {
    setScreen("settings"); setConfig(null); setP1Secret(null);
    setP2Secret(null); setEndData(null); setShowHandoff(false);
  };

  const doRestart = () => {
    if (!config) return goHome();
    setEndData(null); setShowHandoff(false); setP1Secret(null); setP2Secret(null);
    if (config.mode === "single") setScreen("game-single");
    else if (config.mode === "two-vs") setScreen("game-two-vs");
    else { setSetupPhase("p1"); setScreen("setup"); }
  };

  const handleStart = (cfg) => {
    setConfig(cfg); setEndData(null);
    if (cfg.mode === "single") setScreen("game-single");
    else if (cfg.mode === "two-vs") setScreen("game-two-vs");
    else { setSetupPhase("p1"); setScreen("setup"); }
  };

  const handleSetup = (code) => {
    if (setupPhase === "p1") {
      setP1Secret(code);
      setShowHandoff(true);
    } else {
      setP2Secret(code);
      setScreen("game-two");
    }
  };

  const handleHandoffContinue = () => {
    setShowHandoff(false);
    setSetupPhase("p2");
    if (vibration && navigator.vibrate) navigator.vibrate(120);
  };

  const isTwoPlayer = config?.mode === "two" || config?.mode === "two-vs";
  const splitScreen = screen === "game-two" || screen === "game-two-vs";

  const bg = darkMode ? "#0c0c0c" : "#f0ede6";
  const cardBg = darkMode ? "#141414" : "#ffffff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";

  // Show menu button on all screens except settings
  const showMenuBtn = screen !== "settings";

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", padding: splitScreen ? 0 : 16, transition: "background .3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
      {showHandoff && <HandoffPopup nextPlayer={t.player2} onContinue={handleHandoffContinue} t={t} />}
      {showUnlock && <UnlockModal t={t} darkMode={darkMode} onUnlock={handleUnlock} onClose={() => setShowUnlock(false)} />}
      {showHowToPlay && <HowToPlayModal t={t} darkMode={darkMode} onClose={() => setShowHowToPlay(false)} />}
      {showMenu && (
        <MenuDrawer
          onClose={() => setShowMenu(false)}
          darkMode={darkMode} setDarkMode={setDarkMode}
          vibration={vibration} setVibration={setVibration}
          onRestart={doRestart} onHome={goHome}
          lang={lang} setLang={setLang} t={t}
        />
      )}
      <div style={{
        width: "100%", maxWidth: splitScreen ? 420 : 390,
        background: cardBg,
        borderRadius: splitScreen ? 18 : 16,
        border: `1px solid ${cardBorder}`,
        overflow: "hidden",
        boxShadow: darkMode ? "0 24px 80px rgba(0,0,0,.75)" : "0 8px 40px rgba(0,0,0,0.12)",
        padding: 0,
        position: "relative",
      }}>
        {/* Menu button — hidden in split screen (it lives in the divider there) */}
        {showMenuBtn && !splitScreen && (
          <button onClick={() => setShowMenu(true)} style={{
            position: "absolute", top: 12, right: 12, zIndex: 10,
            background: "none", border: `1px solid ${darkMode ? "#2a2a2a" : "#ddd"}`,
            borderRadius: 8, width: 34, height: 34, cursor: "pointer",
            color: "#888", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}>☰</button>
        )}

        {screen === "settings" && <SettingsScreen onStart={handleStart} darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} t={t} isPro={isPro} onShowUnlock={() => setShowUnlock(true)} onShowHowToPlay={() => setShowHowToPlay(true)} />}

        {screen === "setup" && config && (
          <CodeSetupScreen
            key={setupPhase}
            player={setupPhase === "p1" ? t.player1 : t.player2}
            config={config} onDone={handleSetup} flipped={false} darkMode={darkMode} t={t} />
        )}

        {screen === "game-single" && config && (
          <SingleBoard config={config} darkMode={darkMode} t={t} isPro={isPro} onEnd={(status, moves) => {
            setEndData({ p1: { status, moves } });
            setScreen("result");
          }} />
        )}

        {screen === "game-two" && config && p1Secret && p2Secret && (
          <TwoPlayerBoard config={config} p1Secret={p1Secret} p2Secret={p2Secret}
            darkMode={darkMode} vibration={vibration} t={t}
            onMenuOpen={() => setShowMenu(true)}
            onEnd={(p1r, p2r) => {
              setEndData({ p1: p1r, p2: p2r });
              setScreen("result");
            }} />
        )}

        {screen === "game-two-vs" && config && (
          <TwoVsCpuBoard config={config}
            darkMode={darkMode} vibration={vibration} t={t}
            onMenuOpen={() => setShowMenu(true)}
            onEnd={(p1r, p2r) => {
              setEndData({ p1: p1r, p2: p2r });
              setScreen("result");
            }} />
        )}

        {screen === "result" && endData && (
          <ResultScreen
            p1Result={endData.p1} p2Result={endData.p2 || null}
            isSingle={config?.mode === "single"}
            darkMode={darkMode} t={t}
            onRestart={doRestart}
            onHome={goHome}
          />
        )}
      </div>
    </div>
  );
}
