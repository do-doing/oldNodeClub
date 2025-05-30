var DateFormatter
!(function () {
  "use strict"
  var e, t, a, r, n, o, i
  ;(o = 864e5),
    (i = 3600),
    (e = function (e, t) {
      return (
        "string" == typeof e &&
        "string" == typeof t &&
        e.toLowerCase() === t.toLowerCase()
      )
    }),
    (t = function (e, a, r) {
      var n = r || "0",
        o = e.toString()
      return o.length < a ? t(n + o, a) : o
    }),
    (a = function (e) {
      var t, r
      for (e = e || {}, t = 1; t < arguments.length; t++)
        if ((r = arguments[t]))
          for (var n in r)
            r.hasOwnProperty(n) &&
              ("object" == typeof r[n] ? a(e[n], r[n]) : (e[n] = r[n]))
      return e
    }),
    (r = function (e, t) {
      for (var a = 0; a < t.length; a++)
        if (t[a].toLowerCase() === e.toLowerCase()) return a
      return -1
    }),
    (n = {
      dateSettings: {
        days: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        monthsShort: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        meridiem: ["AM", "PM"],
        ordinal: function (e) {
          var t = e % 10,
            a = { 1: "st", 2: "nd", 3: "rd" }
          return 1 !== Math.floor((e % 100) / 10) && a[t] ? a[t] : "th"
        },
      },
      separators: /[ \-+\/\.T:@]/g,
      validParts: /[dDjlNSwzWFmMntLoYyaABgGhHisueTIOPZcrU]/g,
      intParts: /[djwNzmnyYhHgGis]/g,
      tzParts:
        /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
      tzClip: /[^-+\dA-Z]/g,
    }),
    ((DateFormatter = function (e) {
      var t = this,
        r = a(n, e)
      ;(t.dateSettings = r.dateSettings),
        (t.separators = r.separators),
        (t.validParts = r.validParts),
        (t.intParts = r.intParts),
        (t.tzParts = r.tzParts),
        (t.tzClip = r.tzClip)
    }).prototype = {
      constructor: DateFormatter,
      getMonth: function (e) {
        var t,
          a = this
        return (
          0 === (t = r(e, a.dateSettings.monthsShort) + 1) &&
            (t = r(e, a.dateSettings.months) + 1),
          t
        )
      },
      parseDate: function (t, a) {
        var r,
          n,
          o,
          i,
          s,
          u,
          d,
          l,
          f,
          c,
          m = this,
          h = !1,
          g = !1,
          p = m.dateSettings,
          D = {
            date: null,
            year: null,
            month: null,
            day: null,
            hour: 0,
            min: 0,
            sec: 0,
          }
        if (!t) return null
        if (t instanceof Date) return t
        if ("U" === a) return (o = parseInt(t)) ? new Date(1e3 * o) : t
        switch (typeof t) {
          case "number":
            return new Date(t)
          case "string":
            break
          default:
            return null
        }
        if (!(r = a.match(m.validParts)) || 0 === r.length)
          throw new Error("Invalid date format definition.")
        for (
          n = t.replace(m.separators, "\0").split("\0"), o = 0;
          o < n.length;
          o++
        )
          switch (((i = n[o]), (s = parseInt(i)), r[o])) {
            case "y":
            case "Y":
              if (!s) return null
              ;(f = i.length),
                (D.year = 2 === f ? parseInt((70 > s ? "20" : "19") + i) : s),
                (h = !0)
              break
            case "m":
            case "n":
            case "M":
            case "F":
              if (isNaN(s)) {
                if (!((u = m.getMonth(i)) > 0)) return null
                D.month = u
              } else {
                if (!(s >= 1 && 12 >= s)) return null
                D.month = s
              }
              h = !0
              break
            case "d":
            case "j":
              if (!(s >= 1 && 31 >= s)) return null
              ;(D.day = s), (h = !0)
              break
            case "g":
            case "h":
              if (
                ((d =
                  r.indexOf("a") > -1
                    ? r.indexOf("a")
                    : r.indexOf("A") > -1
                    ? r.indexOf("A")
                    : -1),
                (c = n[d]),
                d > -1)
              )
                (l = e(c, p.meridiem[0]) ? 0 : e(c, p.meridiem[1]) ? 12 : -1),
                  s >= 1 && 12 >= s && l > -1
                    ? (D.hour = s + l - 1)
                    : s >= 0 && 23 >= s && (D.hour = s)
              else {
                if (!(s >= 0 && 23 >= s)) return null
                D.hour = s
              }
              g = !0
              break
            case "G":
            case "H":
              if (!(s >= 0 && 23 >= s)) return null
              ;(D.hour = s), (g = !0)
              break
            case "i":
              if (!(s >= 0 && 59 >= s)) return null
              ;(D.min = s), (g = !0)
              break
            case "s":
              if (!(s >= 0 && 59 >= s)) return null
              ;(D.sec = s), (g = !0)
          }
        if (!0 === h && D.year && D.month && D.day)
          D.date = new Date(D.year, D.month - 1, D.day, D.hour, D.min, D.sec, 0)
        else {
          if (!0 !== g) return null
          D.date = new Date(0, 0, 0, D.hour, D.min, D.sec, 0)
        }
        return D.date
      },
      guessDate: function (e, t) {
        if ("string" != typeof e) return e
        var a,
          r,
          n,
          o,
          i,
          s,
          u = this,
          d = e.replace(u.separators, "\0").split("\0"),
          l = /^[djmn]/g,
          f = t.match(u.validParts),
          c = new Date(),
          m = 0
        if (!l.test(f[0])) return e
        for (n = 0; n < d.length; n++) {
          if (((m = 2), (i = d[n]), (s = parseInt(i.substr(0, 2))), isNaN(s)))
            return null
          switch (n) {
            case 0:
              "m" === f[0] || "n" === f[0] ? c.setMonth(s - 1) : c.setDate(s)
              break
            case 1:
              "m" === f[0] || "n" === f[0] ? c.setDate(s) : c.setMonth(s - 1)
              break
            case 2:
              if (
                ((r = c.getFullYear()),
                (a = i.length),
                (m = 4 > a ? a : 4),
                !(r = parseInt(
                  4 > a ? r.toString().substr(0, 4 - a) + i : i.substr(0, 4)
                )))
              )
                return null
              c.setFullYear(r)
              break
            case 3:
              c.setHours(s)
              break
            case 4:
              c.setMinutes(s)
              break
            case 5:
              c.setSeconds(s)
          }
          ;(o = i.substr(m)).length > 0 && d.splice(n + 1, 0, o)
        }
        return c
      },
      parseFormat: function (e, a) {
        var r,
          n = this,
          s = n.dateSettings,
          u = /\\?(.?)/gi,
          d = function (e, t) {
            return r[e] ? r[e]() : t
          }
        return (
          (r = {
            d: function () {
              return t(r.j(), 2)
            },
            D: function () {
              return s.daysShort[r.w()]
            },
            j: function () {
              return a.getDate()
            },
            l: function () {
              return s.days[r.w()]
            },
            N: function () {
              return r.w() || 7
            },
            w: function () {
              return a.getDay()
            },
            z: function () {
              var e = new Date(r.Y(), r.n() - 1, r.j()),
                t = new Date(r.Y(), 0, 1)
              return Math.round((e - t) / o)
            },
            W: function () {
              var e = new Date(r.Y(), r.n() - 1, r.j() - r.N() + 3),
                a = new Date(e.getFullYear(), 0, 4)
              return t(1 + Math.round((e - a) / o / 7), 2)
            },
            F: function () {
              return s.months[a.getMonth()]
            },
            m: function () {
              return t(r.n(), 2)
            },
            M: function () {
              return s.monthsShort[a.getMonth()]
            },
            n: function () {
              return a.getMonth() + 1
            },
            t: function () {
              return new Date(r.Y(), r.n(), 0).getDate()
            },
            L: function () {
              var e = r.Y()
              return (e % 4 == 0 && e % 100 != 0) || e % 400 == 0 ? 1 : 0
            },
            o: function () {
              var e = r.n(),
                t = r.W()
              return r.Y() + (12 === e && 9 > t ? 1 : 1 === e && t > 9 ? -1 : 0)
            },
            Y: function () {
              return a.getFullYear()
            },
            y: function () {
              return r.Y().toString().slice(-2)
            },
            a: function () {
              return r.A().toLowerCase()
            },
            A: function () {
              var e = r.G() < 12 ? 0 : 1
              return s.meridiem[e]
            },
            B: function () {
              var e = a.getUTCHours() * i,
                r = 60 * a.getUTCMinutes(),
                n = a.getUTCSeconds()
              return t(Math.floor((e + r + n + i) / 86.4) % 1e3, 3)
            },
            g: function () {
              return r.G() % 12 || 12
            },
            G: function () {
              return a.getHours()
            },
            h: function () {
              return t(r.g(), 2)
            },
            H: function () {
              return t(r.G(), 2)
            },
            i: function () {
              return t(a.getMinutes(), 2)
            },
            s: function () {
              return t(a.getSeconds(), 2)
            },
            u: function () {
              return t(1e3 * a.getMilliseconds(), 6)
            },
            e: function () {
              return (
                /\((.*)\)/.exec(String(a))[1] || "Coordinated Universal Time"
              )
            },
            I: function () {
              return new Date(r.Y(), 0) - Date.UTC(r.Y(), 0) !=
                new Date(r.Y(), 6) - Date.UTC(r.Y(), 6)
                ? 1
                : 0
            },
            O: function () {
              var e = a.getTimezoneOffset(),
                r = Math.abs(e)
              return (
                (e > 0 ? "-" : "+") + t(100 * Math.floor(r / 60) + (r % 60), 4)
              )
            },
            P: function () {
              var e = r.O()
              return e.substr(0, 3) + ":" + e.substr(3, 2)
            },
            T: function () {
              return (
                (String(a).match(n.tzParts) || [""])
                  .pop()
                  .replace(n.tzClip, "") || "UTC"
              )
            },
            Z: function () {
              return 60 * -a.getTimezoneOffset()
            },
            c: function () {
              return "Y-m-d\\TH:i:sP".replace(u, d)
            },
            r: function () {
              return "D, d M Y H:i:s O".replace(u, d)
            },
            U: function () {
              return a.getTime() / 1e3 || 0
            },
          }),
          d(e, e)
        )
      },
      formatDate: function (e, t) {
        var a,
          r,
          n,
          o,
          i,
          s = this,
          u = ""
        if ("string" == typeof e && !(e = s.parseDate(e, t))) return null
        if (e instanceof Date) {
          for (n = t.length, a = 0; n > a; a++)
            "S" !== (i = t.charAt(a)) &&
              "\\" !== i &&
              (a > 0 && "\\" === t.charAt(a - 1)
                ? (u += i)
                : ((o = s.parseFormat(i, e)),
                  a !== n - 1 &&
                    s.intParts.test(i) &&
                    "S" === t.charAt(a + 1) &&
                    ((r = parseInt(o) || 0), (o += s.dateSettings.ordinal(r))),
                  (u += o)))
          return u
        }
        return ""
      },
    })
})()
var datetimepickerFactory = function (e) {
  "use strict"
  function t(e, t, a) {
    ;(this.date = e), (this.desc = t), (this.style = a)
  }
  var a = {
      i18n: {
        ar: {
          months: [
            "كانون الثاني",
            "شباط",
            "آذار",
            "نيسان",
            "مايو",
            "حزيران",
            "تموز",
            "آب",
            "أيلول",
            "تشرين الأول",
            "تشرين الثاني",
            "كانون الأول",
          ],
          dayOfWeekShort: ["ن", "ث", "ع", "خ", "ج", "س", "ح"],
          dayOfWeek: [
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
            "الأحد",
          ],
        },
        ro: {
          months: [
            "Ianuarie",
            "Februarie",
            "Martie",
            "Aprilie",
            "Mai",
            "Iunie",
            "Iulie",
            "August",
            "Septembrie",
            "Octombrie",
            "Noiembrie",
            "Decembrie",
          ],
          dayOfWeekShort: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"],
          dayOfWeek: [
            "Duminică",
            "Luni",
            "Marţi",
            "Miercuri",
            "Joi",
            "Vineri",
            "Sâmbătă",
          ],
        },
        id: {
          months: [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ],
          dayOfWeekShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
          dayOfWeek: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
          ],
        },
        is: {
          months: [
            "Janúar",
            "Febrúar",
            "Mars",
            "Apríl",
            "Maí",
            "Júní",
            "Júlí",
            "Ágúst",
            "September",
            "Október",
            "Nóvember",
            "Desember",
          ],
          dayOfWeekShort: ["Sun", "Mán", "Þrið", "Mið", "Fim", "Fös", "Lau"],
          dayOfWeek: [
            "Sunnudagur",
            "Mánudagur",
            "Þriðjudagur",
            "Miðvikudagur",
            "Fimmtudagur",
            "Föstudagur",
            "Laugardagur",
          ],
        },
        bg: {
          months: [
            "Януари",
            "Февруари",
            "Март",
            "Април",
            "Май",
            "Юни",
            "Юли",
            "Август",
            "Септември",
            "Октомври",
            "Ноември",
            "Декември",
          ],
          dayOfWeekShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          dayOfWeek: [
            "Неделя",
            "Понеделник",
            "Вторник",
            "Сряда",
            "Четвъртък",
            "Петък",
            "Събота",
          ],
        },
        fa: {
          months: [
            "فروردین",
            "اردیبهشت",
            "خرداد",
            "تیر",
            "مرداد",
            "شهریور",
            "مهر",
            "آبان",
            "آذر",
            "دی",
            "بهمن",
            "اسفند",
          ],
          dayOfWeekShort: [
            "یکشنبه",
            "دوشنبه",
            "سه شنبه",
            "چهارشنبه",
            "پنجشنبه",
            "جمعه",
            "شنبه",
          ],
          dayOfWeek: [
            "یک‌شنبه",
            "دوشنبه",
            "سه‌شنبه",
            "چهارشنبه",
            "پنج‌شنبه",
            "جمعه",
            "شنبه",
            "یک‌شنبه",
          ],
        },
        ru: {
          months: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
          ],
          dayOfWeekShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          dayOfWeek: [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
          ],
        },
        uk: {
          months: [
            "Січень",
            "Лютий",
            "Березень",
            "Квітень",
            "Травень",
            "Червень",
            "Липень",
            "Серпень",
            "Вересень",
            "Жовтень",
            "Листопад",
            "Грудень",
          ],
          dayOfWeekShort: ["Ндл", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"],
          dayOfWeek: [
            "Неділя",
            "Понеділок",
            "Вівторок",
            "Середа",
            "Четвер",
            "П'ятниця",
            "Субота",
          ],
        },
        en: {
          months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          dayOfWeek: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        el: {
          months: [
            "Ιανουάριος",
            "Φεβρουάριος",
            "Μάρτιος",
            "Απρίλιος",
            "Μάιος",
            "Ιούνιος",
            "Ιούλιος",
            "Αύγουστος",
            "Σεπτέμβριος",
            "Οκτώβριος",
            "Νοέμβριος",
            "Δεκέμβριος",
          ],
          dayOfWeekShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
          dayOfWeek: [
            "Κυριακή",
            "Δευτέρα",
            "Τρίτη",
            "Τετάρτη",
            "Πέμπτη",
            "Παρασκευή",
            "Σάββατο",
          ],
        },
        de: {
          months: [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember",
          ],
          dayOfWeekShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
          dayOfWeek: [
            "Sonntag",
            "Montag",
            "Dienstag",
            "Mittwoch",
            "Donnerstag",
            "Freitag",
            "Samstag",
          ],
        },
        nl: {
          months: [
            "januari",
            "februari",
            "maart",
            "april",
            "mei",
            "juni",
            "juli",
            "augustus",
            "september",
            "oktober",
            "november",
            "december",
          ],
          dayOfWeekShort: ["zo", "ma", "di", "wo", "do", "vr", "za"],
          dayOfWeek: [
            "zondag",
            "maandag",
            "dinsdag",
            "woensdag",
            "donderdag",
            "vrijdag",
            "zaterdag",
          ],
        },
        tr: {
          months: [
            "Ocak",
            "Şubat",
            "Mart",
            "Nisan",
            "Mayıs",
            "Haziran",
            "Temmuz",
            "Ağustos",
            "Eylül",
            "Ekim",
            "Kasım",
            "Aralık",
          ],
          dayOfWeekShort: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"],
          dayOfWeek: [
            "Pazar",
            "Pazartesi",
            "Salı",
            "Çarşamba",
            "Perşembe",
            "Cuma",
            "Cumartesi",
          ],
        },
        fr: {
          months: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ],
          dayOfWeekShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
          dayOfWeek: [
            "dimanche",
            "lundi",
            "mardi",
            "mercredi",
            "jeudi",
            "vendredi",
            "samedi",
          ],
        },
        es: {
          months: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
          dayOfWeekShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
          dayOfWeek: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
          ],
        },
        th: {
          months: [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
          ],
          dayOfWeekShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
          dayOfWeek: [
            "อาทิตย์",
            "จันทร์",
            "อังคาร",
            "พุธ",
            "พฤหัส",
            "ศุกร์",
            "เสาร์",
            "อาทิตย์",
          ],
        },
        pl: {
          months: [
            "styczeń",
            "luty",
            "marzec",
            "kwiecień",
            "maj",
            "czerwiec",
            "lipiec",
            "sierpień",
            "wrzesień",
            "październik",
            "listopad",
            "grudzień",
          ],
          dayOfWeekShort: ["nd", "pn", "wt", "śr", "cz", "pt", "sb"],
          dayOfWeek: [
            "niedziela",
            "poniedziałek",
            "wtorek",
            "środa",
            "czwartek",
            "piątek",
            "sobota",
          ],
        },
        pt: {
          months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ],
          dayOfWeekShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
          dayOfWeek: [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ],
        },
        ch: {
          months: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          dayOfWeekShort: ["日", "一", "二", "三", "四", "五", "六"],
        },
        se: {
          months: [
            "Januari",
            "Februari",
            "Mars",
            "April",
            "Maj",
            "Juni",
            "Juli",
            "Augusti",
            "September",
            "Oktober",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
        },
        km: {
          months: [
            "មករា​",
            "កុម្ភៈ",
            "មិនា​",
            "មេសា​",
            "ឧសភា​",
            "មិថុនា​",
            "កក្កដា​",
            "សីហា​",
            "កញ្ញា​",
            "តុលា​",
            "វិច្ឆិកា",
            "ធ្នូ​",
          ],
          dayOfWeekShort: [
            "អាទិ​",
            "ច័ន្ទ​",
            "អង្គារ​",
            "ពុធ​",
            "ព្រហ​​",
            "សុក្រ​",
            "សៅរ៍",
          ],
          dayOfWeek: [
            "អាទិត្យ​",
            "ច័ន្ទ​",
            "អង្គារ​",
            "ពុធ​",
            "ព្រហស្បតិ៍​",
            "សុក្រ​",
            "សៅរ៍",
          ],
        },
        kr: {
          months: [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ],
          dayOfWeekShort: ["일", "월", "화", "수", "목", "금", "토"],
          dayOfWeek: [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
          ],
        },
        it: {
          months: [
            "Gennaio",
            "Febbraio",
            "Marzo",
            "Aprile",
            "Maggio",
            "Giugno",
            "Luglio",
            "Agosto",
            "Settembre",
            "Ottobre",
            "Novembre",
            "Dicembre",
          ],
          dayOfWeekShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
          dayOfWeek: [
            "Domenica",
            "Lunedì",
            "Martedì",
            "Mercoledì",
            "Giovedì",
            "Venerdì",
            "Sabato",
          ],
        },
        da: {
          months: [
            "Januar",
            "Februar",
            "Marts",
            "April",
            "Maj",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
          dayOfWeek: [
            "søndag",
            "mandag",
            "tirsdag",
            "onsdag",
            "torsdag",
            "fredag",
            "lørdag",
          ],
        },
        no: {
          months: [
            "Januar",
            "Februar",
            "Mars",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Desember",
          ],
          dayOfWeekShort: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
          dayOfWeek: [
            "Søndag",
            "Mandag",
            "Tirsdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lørdag",
          ],
        },
        ja: {
          months: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          dayOfWeekShort: ["日", "月", "火", "水", "木", "金", "土"],
          dayOfWeek: ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"],
        },
        vi: {
          months: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          dayOfWeekShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
          dayOfWeek: [
            "Chủ nhật",
            "Thứ hai",
            "Thứ ba",
            "Thứ tư",
            "Thứ năm",
            "Thứ sáu",
            "Thứ bảy",
          ],
        },
        sl: {
          months: [
            "Januar",
            "Februar",
            "Marec",
            "April",
            "Maj",
            "Junij",
            "Julij",
            "Avgust",
            "September",
            "Oktober",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
          dayOfWeek: [
            "Nedelja",
            "Ponedeljek",
            "Torek",
            "Sreda",
            "Četrtek",
            "Petek",
            "Sobota",
          ],
        },
        cs: {
          months: [
            "Leden",
            "Únor",
            "Březen",
            "Duben",
            "Květen",
            "Červen",
            "Červenec",
            "Srpen",
            "Září",
            "Říjen",
            "Listopad",
            "Prosinec",
          ],
          dayOfWeekShort: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
        },
        hu: {
          months: [
            "Január",
            "Február",
            "Március",
            "Április",
            "Május",
            "Június",
            "Július",
            "Augusztus",
            "Szeptember",
            "Október",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Va", "Hé", "Ke", "Sze", "Cs", "Pé", "Szo"],
          dayOfWeek: [
            "vasárnap",
            "hétfő",
            "kedd",
            "szerda",
            "csütörtök",
            "péntek",
            "szombat",
          ],
        },
        az: {
          months: [
            "Yanvar",
            "Fevral",
            "Mart",
            "Aprel",
            "May",
            "Iyun",
            "Iyul",
            "Avqust",
            "Sentyabr",
            "Oktyabr",
            "Noyabr",
            "Dekabr",
          ],
          dayOfWeekShort: ["B", "Be", "Ça", "Ç", "Ca", "C", "Ş"],
          dayOfWeek: [
            "Bazar",
            "Bazar ertəsi",
            "Çərşənbə axşamı",
            "Çərşənbə",
            "Cümə axşamı",
            "Cümə",
            "Şənbə",
          ],
        },
        bs: {
          months: [
            "Januar",
            "Februar",
            "Mart",
            "April",
            "Maj",
            "Jun",
            "Jul",
            "Avgust",
            "Septembar",
            "Oktobar",
            "Novembar",
            "Decembar",
          ],
          dayOfWeekShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
          dayOfWeek: [
            "Nedjelja",
            "Ponedjeljak",
            "Utorak",
            "Srijeda",
            "Četvrtak",
            "Petak",
            "Subota",
          ],
        },
        ca: {
          months: [
            "Gener",
            "Febrer",
            "Març",
            "Abril",
            "Maig",
            "Juny",
            "Juliol",
            "Agost",
            "Setembre",
            "Octubre",
            "Novembre",
            "Desembre",
          ],
          dayOfWeekShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
          dayOfWeek: [
            "Diumenge",
            "Dilluns",
            "Dimarts",
            "Dimecres",
            "Dijous",
            "Divendres",
            "Dissabte",
          ],
        },
        "en-GB": {
          months: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          dayOfWeek: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
        et: {
          months: [
            "Jaanuar",
            "Veebruar",
            "Märts",
            "Aprill",
            "Mai",
            "Juuni",
            "Juuli",
            "August",
            "September",
            "Oktoober",
            "November",
            "Detsember",
          ],
          dayOfWeekShort: ["P", "E", "T", "K", "N", "R", "L"],
          dayOfWeek: [
            "Pühapäev",
            "Esmaspäev",
            "Teisipäev",
            "Kolmapäev",
            "Neljapäev",
            "Reede",
            "Laupäev",
          ],
        },
        eu: {
          months: [
            "Urtarrila",
            "Otsaila",
            "Martxoa",
            "Apirila",
            "Maiatza",
            "Ekaina",
            "Uztaila",
            "Abuztua",
            "Iraila",
            "Urria",
            "Azaroa",
            "Abendua",
          ],
          dayOfWeekShort: ["Ig.", "Al.", "Ar.", "Az.", "Og.", "Or.", "La."],
          dayOfWeek: [
            "Igandea",
            "Astelehena",
            "Asteartea",
            "Asteazkena",
            "Osteguna",
            "Ostirala",
            "Larunbata",
          ],
        },
        fi: {
          months: [
            "Tammikuu",
            "Helmikuu",
            "Maaliskuu",
            "Huhtikuu",
            "Toukokuu",
            "Kesäkuu",
            "Heinäkuu",
            "Elokuu",
            "Syyskuu",
            "Lokakuu",
            "Marraskuu",
            "Joulukuu",
          ],
          dayOfWeekShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
          dayOfWeek: [
            "sunnuntai",
            "maanantai",
            "tiistai",
            "keskiviikko",
            "torstai",
            "perjantai",
            "lauantai",
          ],
        },
        gl: {
          months: [
            "Xan",
            "Feb",
            "Maz",
            "Abr",
            "Mai",
            "Xun",
            "Xul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dec",
          ],
          dayOfWeekShort: ["Dom", "Lun", "Mar", "Mer", "Xov", "Ven", "Sab"],
          dayOfWeek: [
            "Domingo",
            "Luns",
            "Martes",
            "Mércores",
            "Xoves",
            "Venres",
            "Sábado",
          ],
        },
        hr: {
          months: [
            "Siječanj",
            "Veljača",
            "Ožujak",
            "Travanj",
            "Svibanj",
            "Lipanj",
            "Srpanj",
            "Kolovoz",
            "Rujan",
            "Listopad",
            "Studeni",
            "Prosinac",
          ],
          dayOfWeekShort: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
          dayOfWeek: [
            "Nedjelja",
            "Ponedjeljak",
            "Utorak",
            "Srijeda",
            "Četvrtak",
            "Petak",
            "Subota",
          ],
        },
        ko: {
          months: [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
          ],
          dayOfWeekShort: ["일", "월", "화", "수", "목", "금", "토"],
          dayOfWeek: [
            "일요일",
            "월요일",
            "화요일",
            "수요일",
            "목요일",
            "금요일",
            "토요일",
          ],
        },
        lt: {
          months: [
            "Sausio",
            "Vasario",
            "Kovo",
            "Balandžio",
            "Gegužės",
            "Birželio",
            "Liepos",
            "Rugpjūčio",
            "Rugsėjo",
            "Spalio",
            "Lapkričio",
            "Gruodžio",
          ],
          dayOfWeekShort: ["Sek", "Pir", "Ant", "Tre", "Ket", "Pen", "Šeš"],
          dayOfWeek: [
            "Sekmadienis",
            "Pirmadienis",
            "Antradienis",
            "Trečiadienis",
            "Ketvirtadienis",
            "Penktadienis",
            "Šeštadienis",
          ],
        },
        lv: {
          months: [
            "Janvāris",
            "Februāris",
            "Marts",
            "Aprīlis ",
            "Maijs",
            "Jūnijs",
            "Jūlijs",
            "Augusts",
            "Septembris",
            "Oktobris",
            "Novembris",
            "Decembris",
          ],
          dayOfWeekShort: ["Sv", "Pr", "Ot", "Tr", "Ct", "Pk", "St"],
          dayOfWeek: [
            "Svētdiena",
            "Pirmdiena",
            "Otrdiena",
            "Trešdiena",
            "Ceturtdiena",
            "Piektdiena",
            "Sestdiena",
          ],
        },
        mk: {
          months: [
            "јануари",
            "февруари",
            "март",
            "април",
            "мај",
            "јуни",
            "јули",
            "август",
            "септември",
            "октомври",
            "ноември",
            "декември",
          ],
          dayOfWeekShort: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
          dayOfWeek: [
            "Недела",
            "Понеделник",
            "Вторник",
            "Среда",
            "Четврток",
            "Петок",
            "Сабота",
          ],
        },
        mn: {
          months: [
            "1-р сар",
            "2-р сар",
            "3-р сар",
            "4-р сар",
            "5-р сар",
            "6-р сар",
            "7-р сар",
            "8-р сар",
            "9-р сар",
            "10-р сар",
            "11-р сар",
            "12-р сар",
          ],
          dayOfWeekShort: ["Дав", "Мяг", "Лха", "Пүр", "Бсн", "Бям", "Ням"],
          dayOfWeek: [
            "Даваа",
            "Мягмар",
            "Лхагва",
            "Пүрэв",
            "Баасан",
            "Бямба",
            "Ням",
          ],
        },
        "pt-BR": {
          months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
          ],
          dayOfWeekShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
          dayOfWeek: [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ],
        },
        sk: {
          months: [
            "Január",
            "Február",
            "Marec",
            "Apríl",
            "Máj",
            "Jún",
            "Júl",
            "August",
            "September",
            "Október",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"],
          dayOfWeek: [
            "Nedeľa",
            "Pondelok",
            "Utorok",
            "Streda",
            "Štvrtok",
            "Piatok",
            "Sobota",
          ],
        },
        sq: {
          months: [
            "Janar",
            "Shkurt",
            "Mars",
            "Prill",
            "Maj",
            "Qershor",
            "Korrik",
            "Gusht",
            "Shtator",
            "Tetor",
            "Nëntor",
            "Dhjetor",
          ],
          dayOfWeekShort: ["Die", "Hën", "Mar", "Mër", "Enj", "Pre", "Shtu"],
          dayOfWeek: [
            "E Diel",
            "E Hënë",
            "E Martē",
            "E Mërkurë",
            "E Enjte",
            "E Premte",
            "E Shtunë",
          ],
        },
        "sr-YU": {
          months: [
            "Januar",
            "Februar",
            "Mart",
            "April",
            "Maj",
            "Jun",
            "Jul",
            "Avgust",
            "Septembar",
            "Oktobar",
            "Novembar",
            "Decembar",
          ],
          dayOfWeekShort: ["Ned", "Pon", "Uto", "Sre", "čet", "Pet", "Sub"],
          dayOfWeek: [
            "Nedelja",
            "Ponedeljak",
            "Utorak",
            "Sreda",
            "Četvrtak",
            "Petak",
            "Subota",
          ],
        },
        sr: {
          months: [
            "јануар",
            "фебруар",
            "март",
            "април",
            "мај",
            "јун",
            "јул",
            "август",
            "септембар",
            "октобар",
            "новембар",
            "децембар",
          ],
          dayOfWeekShort: ["нед", "пон", "уто", "сре", "чет", "пет", "суб"],
          dayOfWeek: [
            "Недеља",
            "Понедељак",
            "Уторак",
            "Среда",
            "Четвртак",
            "Петак",
            "Субота",
          ],
        },
        sv: {
          months: [
            "Januari",
            "Februari",
            "Mars",
            "April",
            "Maj",
            "Juni",
            "Juli",
            "Augusti",
            "September",
            "Oktober",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
          dayOfWeek: [
            "Söndag",
            "Måndag",
            "Tisdag",
            "Onsdag",
            "Torsdag",
            "Fredag",
            "Lördag",
          ],
        },
        "zh-TW": {
          months: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          dayOfWeekShort: ["日", "一", "二", "三", "四", "五", "六"],
          dayOfWeek: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ],
        },
        zh: {
          months: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          dayOfWeekShort: ["日", "一", "二", "三", "四", "五", "六"],
          dayOfWeek: [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ],
        },
        ug: {
          months: [
            "1-ئاي",
            "2-ئاي",
            "3-ئاي",
            "4-ئاي",
            "5-ئاي",
            "6-ئاي",
            "7-ئاي",
            "8-ئاي",
            "9-ئاي",
            "10-ئاي",
            "11-ئاي",
            "12-ئاي",
          ],
          dayOfWeek: [
            "يەكشەنبە",
            "دۈشەنبە",
            "سەيشەنبە",
            "چارشەنبە",
            "پەيشەنبە",
            "جۈمە",
            "شەنبە",
          ],
        },
        he: {
          months: [
            "ינואר",
            "פברואר",
            "מרץ",
            "אפריל",
            "מאי",
            "יוני",
            "יולי",
            "אוגוסט",
            "ספטמבר",
            "אוקטובר",
            "נובמבר",
            "דצמבר",
          ],
          dayOfWeekShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"],
          dayOfWeek: [
            "ראשון",
            "שני",
            "שלישי",
            "רביעי",
            "חמישי",
            "שישי",
            "שבת",
            "ראשון",
          ],
        },
        hy: {
          months: [
            "Հունվար",
            "Փետրվար",
            "Մարտ",
            "Ապրիլ",
            "Մայիս",
            "Հունիս",
            "Հուլիս",
            "Օգոստոս",
            "Սեպտեմբեր",
            "Հոկտեմբեր",
            "Նոյեմբեր",
            "Դեկտեմբեր",
          ],
          dayOfWeekShort: ["Կի", "Երկ", "Երք", "Չոր", "Հնգ", "Ուրբ", "Շբթ"],
          dayOfWeek: [
            "Կիրակի",
            "Երկուշաբթի",
            "Երեքշաբթի",
            "Չորեքշաբթի",
            "Հինգշաբթի",
            "Ուրբաթ",
            "Շաբաթ",
          ],
        },
        kg: {
          months: [
            "Үчтүн айы",
            "Бирдин айы",
            "Жалган Куран",
            "Чын Куран",
            "Бугу",
            "Кулжа",
            "Теке",
            "Баш Оона",
            "Аяк Оона",
            "Тогуздун айы",
            "Жетинин айы",
            "Бештин айы",
          ],
          dayOfWeekShort: ["Жек", "Дүй", "Шей", "Шар", "Бей", "Жум", "Ише"],
          dayOfWeek: [
            "Жекшемб",
            "Дүйшөмб",
            "Шейшемб",
            "Шаршемб",
            "Бейшемби",
            "Жума",
            "Ишенб",
          ],
        },
        rm: {
          months: [
            "Schaner",
            "Favrer",
            "Mars",
            "Avrigl",
            "Matg",
            "Zercladur",
            "Fanadur",
            "Avust",
            "Settember",
            "October",
            "November",
            "December",
          ],
          dayOfWeekShort: ["Du", "Gli", "Ma", "Me", "Gie", "Ve", "So"],
          dayOfWeek: [
            "Dumengia",
            "Glindesdi",
            "Mardi",
            "Mesemna",
            "Gievgia",
            "Venderdi",
            "Sonda",
          ],
        },
        ka: {
          months: [
            "იანვარი",
            "თებერვალი",
            "მარტი",
            "აპრილი",
            "მაისი",
            "ივნისი",
            "ივლისი",
            "აგვისტო",
            "სექტემბერი",
            "ოქტომბერი",
            "ნოემბერი",
            "დეკემბერი",
          ],
          dayOfWeekShort: ["კვ", "ორშ", "სამშ", "ოთხ", "ხუთ", "პარ", "შაბ"],
          dayOfWeek: [
            "კვირა",
            "ორშაბათი",
            "სამშაბათი",
            "ოთხშაბათი",
            "ხუთშაბათი",
            "პარასკევი",
            "შაბათი",
          ],
        },
      },
      ownerDocument: document,
      contentWindow: window,
      value: "",
      rtl: !1,
      format: "Y/m/d H:i",
      formatTime: "H:i",
      formatDate: "Y/m/d",
      startDate: !1,
      step: 60,
      monthChangeSpinner: !0,
      closeOnDateSelect: !1,
      closeOnTimeSelect: !0,
      closeOnWithoutClick: !0,
      closeOnInputClick: !0,
      openOnFocus: !0,
      timepicker: !0,
      datepicker: !0,
      weeks: !1,
      defaultTime: !1,
      defaultDate: !1,
      minDate: !1,
      maxDate: !1,
      minTime: !1,
      maxTime: !1,
      minDateTime: !1,
      maxDateTime: !1,
      allowTimes: [],
      opened: !1,
      initTime: !0,
      inline: !1,
      theme: "",
      touchMovedThreshold: 5,
      onSelectDate: function () {},
      onSelectTime: function () {},
      onChangeMonth: function () {},
      onGetWeekOfYear: function () {},
      onChangeYear: function () {},
      onChangeDateTime: function () {},
      onShow: function () {},
      onClose: function () {},
      onGenerate: function () {},
      withoutCopyright: !0,
      inverseButton: !1,
      hours12: !1,
      next: "xdsoft_next",
      prev: "xdsoft_prev",
      dayOfWeekStart: 0,
      parentID: "body",
      timeHeightInTimePicker: 25,
      timepickerScrollbar: !0,
      todayButton: !0,
      prevButton: !0,
      nextButton: !0,
      defaultSelect: !0,
      scrollMonth: !0,
      scrollTime: !0,
      scrollInput: !0,
      lazyInit: !1,
      mask: !1,
      validateOnBlur: !0,
      allowBlank: !0,
      yearStart: 1950,
      yearEnd: 2050,
      monthStart: 0,
      monthEnd: 11,
      style: "",
      id: "",
      fixed: !1,
      roundTime: "round",
      className: "",
      weekends: [],
      highlightedDates: [],
      highlightedPeriods: [],
      allowDates: [],
      allowDateRe: null,
      disabledDates: [],
      disabledWeekDays: [],
      yearOffset: 0,
      beforeShowDay: null,
      enterLikeTab: !0,
      showApplyButton: !1,
    },
    r = null,
    n = null,
    o = "en",
    i = { meridiem: ["AM", "PM"] },
    s = function () {
      var t = a.i18n[o],
        s = {
          days: t.dayOfWeek,
          daysShort: t.dayOfWeekShort,
          months: t.months,
          monthsShort: e.map(t.months, function (e) {
            return e.substring(0, 3)
          }),
        }
      "function" == typeof DateFormatter &&
        (r = n = new DateFormatter({ dateSettings: e.extend({}, i, s) }))
    },
    u = {
      moment: {
        default_options: {
          format: "YYYY/MM/DD HH:mm",
          formatDate: "YYYY/MM/DD",
          formatTime: "HH:mm",
        },
        formatter: {
          parseDate: function (e, t) {
            if (l(t)) return n.parseDate(e, t)
            var a = moment(e, t)
            return !!a.isValid() && a.toDate()
          },
          formatDate: function (e, t) {
            return l(t) ? n.formatDate(e, t) : moment(e).format(t)
          },
          formatMask: function (e) {
            return e
              .replace(/Y{4}/g, "9999")
              .replace(/Y{2}/g, "99")
              .replace(/M{2}/g, "19")
              .replace(/D{2}/g, "39")
              .replace(/H{2}/g, "29")
              .replace(/m{2}/g, "59")
              .replace(/s{2}/g, "59")
          },
        },
      },
    }
  e.datetimepicker = {
    setLocale: function (e) {
      var t = a.i18n[e] ? e : "en"
      o !== t && ((o = t), s())
    },
    setDateFormatter: function (t) {
      if ("string" == typeof t && u.hasOwnProperty(t)) {
        var n = u[t]
        e.extend(a, n.default_options), (r = n.formatter)
      } else r = t
    },
  }
  var d = {
      RFC_2822: "D, d M Y H:i:s O",
      ATOM: "Y-m-dTH:i:sP",
      ISO_8601: "Y-m-dTH:i:sO",
      RFC_822: "D, d M y H:i:s O",
      RFC_850: "l, d-M-y H:i:s T",
      RFC_1036: "D, d M y H:i:s O",
      RFC_1123: "D, d M Y H:i:s O",
      RSS: "D, d M Y H:i:s O",
      W3C: "Y-m-dTH:i:sP",
    },
    l = function (e) {
      return -1 !== Object.values(d).indexOf(e)
    }
  e.extend(e.datetimepicker, d),
    s(),
    window.getComputedStyle ||
      (window.getComputedStyle = function (e) {
        return (
          (this.el = e),
          (this.getPropertyValue = function (t) {
            var a = /(-([a-z]))/g
            return (
              "float" === t && (t = "styleFloat"),
              a.test(t) &&
                (t = t.replace(a, function (e, t, a) {
                  return a.toUpperCase()
                })),
              e.currentStyle[t] || null
            )
          }),
          this
        )
      }),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = function (e, t) {
        var a, r
        for (a = t || 0, r = this.length; a < r; a += 1)
          if (this[a] === e) return a
        return -1
      }),
    (Date.prototype.countDaysInMonth = function () {
      return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate()
    }),
    (e.fn.xdsoftScroller = function (t, a) {
      return this.each(function () {
        var r,
          n,
          o,
          i,
          s,
          u = e(this),
          d = function (e) {
            var t,
              a = { x: 0, y: 0 }
            return (
              "touchstart" === e.type ||
              "touchmove" === e.type ||
              "touchend" === e.type ||
              "touchcancel" === e.type
                ? ((t =
                    e.originalEvent.touches[0] ||
                    e.originalEvent.changedTouches[0]),
                  (a.x = t.clientX),
                  (a.y = t.clientY))
                : ("mousedown" !== e.type &&
                    "mouseup" !== e.type &&
                    "mousemove" !== e.type &&
                    "mouseover" !== e.type &&
                    "mouseout" !== e.type &&
                    "mouseenter" !== e.type &&
                    "mouseleave" !== e.type) ||
                  ((a.x = e.clientX), (a.y = e.clientY)),
              a
            )
          },
          l = 100,
          f = !1,
          c = 0,
          m = 0,
          h = 0,
          g = !1,
          p = 0,
          D = function () {}
        "hide" !== a
          ? (e(this).hasClass("xdsoft_scroller_box") ||
              ((r = u.children().eq(0)),
              (n = u[0].clientHeight),
              (o = r[0].offsetHeight),
              (i = e('<div class="xdsoft_scrollbar"></div>')),
              (s = e('<div class="xdsoft_scroller"></div>')),
              i.append(s),
              u.addClass("xdsoft_scroller_box").append(i),
              (D = function (e) {
                var t = d(e).y - c + p
                t < 0 && (t = 0),
                  t + s[0].offsetHeight > h && (t = h - s[0].offsetHeight),
                  u.trigger("scroll_element.xdsoft_scroller", [l ? t / l : 0])
              }),
              s
                .on(
                  "touchstart.xdsoft_scroller mousedown.xdsoft_scroller",
                  function (r) {
                    n || u.trigger("resize_scroll.xdsoft_scroller", [a]),
                      (c = d(r).y),
                      (p = parseInt(s.css("margin-top"), 10)),
                      (h = i[0].offsetHeight),
                      "mousedown" === r.type || "touchstart" === r.type
                        ? (t.ownerDocument &&
                            e(t.ownerDocument.body).addClass("xdsoft_noselect"),
                          e([t.ownerDocument.body, t.contentWindow]).on(
                            "touchend mouseup.xdsoft_scroller",
                            function a() {
                              e([t.ownerDocument.body, t.contentWindow])
                                .off("touchend mouseup.xdsoft_scroller", a)
                                .off("mousemove.xdsoft_scroller", D)
                                .removeClass("xdsoft_noselect")
                            }
                          ),
                          e(t.ownerDocument.body).on(
                            "mousemove.xdsoft_scroller",
                            D
                          ))
                        : ((g = !0), r.stopPropagation(), r.preventDefault())
                  }
                )
                .on("touchmove", function (e) {
                  g && (e.preventDefault(), D(e))
                })
                .on("touchend touchcancel", function () {
                  ;(g = !1), (p = 0)
                }),
              u
                .on("scroll_element.xdsoft_scroller", function (e, t) {
                  n || u.trigger("resize_scroll.xdsoft_scroller", [t, !0]),
                    (t = t > 1 ? 1 : t < 0 || isNaN(t) ? 0 : t),
                    s.css("margin-top", l * t),
                    setTimeout(function () {
                      r.css(
                        "marginTop",
                        -parseInt((r[0].offsetHeight - n) * t, 10)
                      )
                    }, 10)
                })
                .on("resize_scroll.xdsoft_scroller", function (e, t, a) {
                  var d, f
                  ;(n = u[0].clientHeight),
                    (o = r[0].offsetHeight),
                    (f = (d = n / o) * i[0].offsetHeight),
                    d > 1
                      ? s.hide()
                      : (s.show(),
                        s.css("height", parseInt(f > 10 ? f : 10, 10)),
                        (l = i[0].offsetHeight - s[0].offsetHeight),
                        !0 !== a &&
                          u.trigger("scroll_element.xdsoft_scroller", [
                            t ||
                              Math.abs(parseInt(r.css("marginTop"), 10)) /
                                (o - n),
                          ]))
                }),
              u.on("mousewheel", function (e) {
                var t = Math.abs(parseInt(r.css("marginTop"), 10))
                return (
                  (t -= 20 * e.deltaY) < 0 && (t = 0),
                  u.trigger("scroll_element.xdsoft_scroller", [t / (o - n)]),
                  e.stopPropagation(),
                  !1
                )
              }),
              u.on("touchstart", function (e) {
                ;(f = d(e)), (m = Math.abs(parseInt(r.css("marginTop"), 10)))
              }),
              u.on("touchmove", function (e) {
                if (f) {
                  e.preventDefault()
                  var t = d(e)
                  u.trigger("scroll_element.xdsoft_scroller", [
                    (m - (t.y - f.y)) / (o - n),
                  ])
                }
              }),
              u.on("touchend touchcancel", function () {
                ;(f = !1), (m = 0)
              })),
            u.trigger("resize_scroll.xdsoft_scroller", [a]))
          : u.find(".xdsoft_scrollbar").hide()
      })
    }),
    (e.fn.datetimepicker = function (n, i) {
      var s,
        u,
        d = this,
        l = 48,
        f = 57,
        c = 96,
        m = 105,
        h = 17,
        g = 46,
        p = 13,
        D = 27,
        v = 8,
        y = 37,
        b = 38,
        k = 39,
        x = 40,
        T = 9,
        S = 116,
        M = 65,
        w = 67,
        O = 86,
        W = 90,
        _ = 89,
        F = !1,
        C =
          e.isPlainObject(n) || !n
            ? e.extend(!0, {}, a, n)
            : e.extend(!0, {}, a),
        P = 0,
        Y = function (e) {
          e.on(
            "open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart",
            function t() {
              e.is(":disabled") ||
                e.data("xdsoft_datetimepicker") ||
                (clearTimeout(P),
                (P = setTimeout(function () {
                  e.data("xdsoft_datetimepicker") || s(e),
                    e
                      .off(
                        "open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart",
                        t
                      )
                      .trigger("open.xdsoft")
                }, 100)))
            }
          )
        }
      return (
        (s = function (a) {
          function i() {
            var e,
              t = !1
            return (
              C.startDate
                ? (t = A.strToDate(C.startDate))
                : (t = C.value || (a && a.val && a.val() ? a.val() : ""))
                ? ((t = A.strToDateTime(t)),
                  C.yearOffset &&
                    (t = new Date(
                      t.getFullYear() - C.yearOffset,
                      t.getMonth(),
                      t.getDate(),
                      t.getHours(),
                      t.getMinutes(),
                      t.getSeconds(),
                      t.getMilliseconds()
                    )))
                : C.defaultDate &&
                  ((t = A.strToDateTime(C.defaultDate)),
                  C.defaultTime &&
                    ((e = A.strtotime(C.defaultTime)),
                    t.setHours(e.getHours()),
                    t.setMinutes(e.getMinutes()))),
              t && A.isValidDate(t) ? j.data("changed", !0) : (t = ""),
              t || 0
            )
          }
          function s(t) {
            var n = function (e, t) {
                var a = e
                  .replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, "\\$1")
                  .replace(/_/g, "{digit+}")
                  .replace(/([0-9]{1})/g, "{digit$1}")
                  .replace(/\{digit([0-9]{1})\}/g, "[0-$1_]{1}")
                  .replace(/\{digit[\+]\}/g, "[0-9_]{1}")
                return new RegExp(a).test(t)
              },
              o = function (e, a) {
                if (
                  !(e =
                    "string" == typeof e || e instanceof String
                      ? t.ownerDocument.getElementById(e)
                      : e)
                )
                  return !1
                if (e.createTextRange) {
                  var r = e.createTextRange()
                  return (
                    r.collapse(!0),
                    r.moveEnd("character", a),
                    r.moveStart("character", a),
                    r.select(),
                    !0
                  )
                }
                return !!e.setSelectionRange && (e.setSelectionRange(a, a), !0)
              }
            t.mask && a.off("keydown.xdsoft"),
              !0 === t.mask &&
                (r.formatMask
                  ? (t.mask = r.formatMask(t.format))
                  : (t.mask = t.format
                      .replace(/Y/g, "9999")
                      .replace(/F/g, "9999")
                      .replace(/m/g, "19")
                      .replace(/d/g, "39")
                      .replace(/H/g, "29")
                      .replace(/i/g, "59")
                      .replace(/s/g, "59"))),
              "string" === e.type(t.mask) &&
                (n(t.mask, a.val()) ||
                  (a.val(t.mask.replace(/[0-9]/g, "_")), o(a[0], 0)),
                a.on("paste.xdsoft", function (r) {
                  var i = (
                      r.clipboardData ||
                      r.originalEvent.clipboardData ||
                      window.clipboardData
                    ).getData("text"),
                    s = this.value,
                    u = this.selectionStart
                  return (
                    (s = s.substr(0, u) + i + s.substr(u + i.length)),
                    (u += i.length),
                    n(t.mask, s)
                      ? ((this.value = s), o(this, u))
                      : "" === e.trim(s)
                      ? (this.value = t.mask.replace(/[0-9]/g, "_"))
                      : a.trigger("error_input.xdsoft"),
                    r.preventDefault(),
                    !1
                  )
                }),
                a.on("keydown.xdsoft", function (r) {
                  var i,
                    s = this.value,
                    u = r.which,
                    d = this.selectionStart,
                    C = this.selectionEnd,
                    P = d !== C
                  if (
                    (u >= l && u <= f) ||
                    (u >= c && u <= m) ||
                    u === v ||
                    u === g
                  ) {
                    for (
                      i =
                        u === v || u === g
                          ? "_"
                          : String.fromCharCode(c <= u && u <= m ? u - l : u),
                        u === v && d && !P && (d -= 1);
                      ;

                    ) {
                      var Y = t.mask.substr(d, 1),
                        A = d < t.mask.length,
                        H = d > 0
                      if (!(/[^0-9_]/.test(Y) && A && H)) break
                      d += u !== v || P ? 1 : -1
                    }
                    if (P) {
                      var j = C - d,
                        J = t.mask.replace(/[0-9]/g, "_"),
                        z = J.substr(d, j).substr(1)
                      s = s.substr(0, d) + (i + z) + s.substr(d + j)
                    } else s = s.substr(0, d) + i + s.substr(d + 1)
                    if ("" === e.trim(s)) s = J
                    else if (d === t.mask.length) return r.preventDefault(), !1
                    for (
                      d += u === v ? 0 : 1;
                      /[^0-9_]/.test(t.mask.substr(d, 1)) &&
                      d < t.mask.length &&
                      d > 0;

                    )
                      d += u === v ? 0 : 1
                    n(t.mask, s)
                      ? ((this.value = s), o(this, d))
                      : "" === e.trim(s)
                      ? (this.value = t.mask.replace(/[0-9]/g, "_"))
                      : a.trigger("error_input.xdsoft")
                  } else if ((-1 !== [M, w, O, W, _].indexOf(u) && F) || -1 !== [D, b, x, y, k, S, h, T, p].indexOf(u)) return !0
                  return r.preventDefault(), !1
                }))
          }
          var u,
            d,
            P,
            Y,
            A,
            H,
            j = e('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'),
            J = e(
              '<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'
            ),
            z = e('<div class="xdsoft_datepicker active"></div>'),
            I = e(
              '<div class="xdsoft_monthpicker"><button type="button" class="xdsoft_prev"></button><button type="button" class="xdsoft_today_button"></button><div class="xdsoft_label xdsoft_month"><span></span><i></i></div><div class="xdsoft_label xdsoft_year"><span></span><i></i></div><button type="button" class="xdsoft_next"></button></div>'
            ),
            N = e('<div class="xdsoft_calendar"></div>'),
            L = e(
              '<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"></button></div>'
            ),
            E = L.find(".xdsoft_time_box").eq(0),
            R = e('<div class="xdsoft_time_variant"></div>'),
            V = e(
              '<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'
            ),
            B = e(
              '<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'
            ),
            G = e(
              '<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'
            ),
            U = !1,
            q = 0
          C.id && j.attr("id", C.id),
            C.style && j.attr("style", C.style),
            C.weeks && j.addClass("xdsoft_showweeks"),
            C.rtl && j.addClass("xdsoft_rtl"),
            j.addClass("xdsoft_" + C.theme),
            j.addClass(C.className),
            I.find(".xdsoft_month span").after(B),
            I.find(".xdsoft_year span").after(G),
            I.find(".xdsoft_month,.xdsoft_year").on(
              "touchstart mousedown.xdsoft",
              function (t) {
                var a,
                  r,
                  n = e(this).find(".xdsoft_select").eq(0),
                  o = 0,
                  i = 0,
                  s = n.is(":visible")
                for (
                  I.find(".xdsoft_select").hide(),
                    A.currentTime &&
                      (o =
                        A.currentTime[
                          e(this).hasClass("xdsoft_month")
                            ? "getMonth"
                            : "getFullYear"
                        ]()),
                    n[s ? "hide" : "show"](),
                    a = n.find("div.xdsoft_option"),
                    r = 0;
                  r < a.length && a.eq(r).data("value") !== o;
                  r += 1
                )
                  i += a[0].offsetHeight
                return (
                  n.xdsoftScroller(
                    C,
                    i / (n.children()[0].offsetHeight - n[0].clientHeight)
                  ),
                  t.stopPropagation(),
                  !1
                )
              }
            )
          var X = function (e) {
            var t = e.originalEvent,
              a = t.touches ? t.touches[0] : t
            this.touchStartPosition = this.touchStartPosition || a
            var r = Math.abs(this.touchStartPosition.clientX - a.clientX),
              n = Math.abs(this.touchStartPosition.clientY - a.clientY)
            Math.sqrt(r * r + n * n) > C.touchMovedThreshold &&
              (this.touchMoved = !0)
          }
          I.find(".xdsoft_select")
            .xdsoftScroller(C)
            .on("touchstart mousedown.xdsoft", function (e) {
              var t = e.originalEvent
              ;(this.touchMoved = !1),
                (this.touchStartPosition = t.touches ? t.touches[0] : t),
                e.stopPropagation(),
                e.preventDefault()
            })
            .on("touchmove", ".xdsoft_option", X)
            .on("touchend mousedown.xdsoft", ".xdsoft_option", function () {
              if (!this.touchMoved) {
                ;(void 0 !== A.currentTime && null !== A.currentTime) ||
                  (A.currentTime = A.now())
                var t = A.currentTime.getFullYear()
                A &&
                  A.currentTime &&
                  A.currentTime[
                    e(this).parent().parent().hasClass("xdsoft_monthselect")
                      ? "setMonth"
                      : "setFullYear"
                  ](e(this).data("value")),
                  e(this).parent().parent().hide(),
                  j.trigger("xchange.xdsoft"),
                  C.onChangeMonth &&
                    e.isFunction(C.onChangeMonth) &&
                    C.onChangeMonth.call(j, A.currentTime, j.data("input")),
                  t !== A.currentTime.getFullYear() &&
                    e.isFunction(C.onChangeYear) &&
                    C.onChangeYear.call(j, A.currentTime, j.data("input"))
              }
            }),
            (j.getValue = function () {
              return A.getCurrentTime()
            }),
            (j.setOptions = function (n) {
              var o = {}
              ;(C = e.extend(!0, {}, C, n)),
                n.allowTimes &&
                  e.isArray(n.allowTimes) &&
                  n.allowTimes.length &&
                  (C.allowTimes = e.extend(!0, [], n.allowTimes)),
                n.weekends &&
                  e.isArray(n.weekends) &&
                  n.weekends.length &&
                  (C.weekends = e.extend(!0, [], n.weekends)),
                n.allowDates &&
                  e.isArray(n.allowDates) &&
                  n.allowDates.length &&
                  (C.allowDates = e.extend(!0, [], n.allowDates)),
                n.allowDateRe &&
                  "[object String]" ===
                    Object.prototype.toString.call(n.allowDateRe) &&
                  (C.allowDateRe = new RegExp(n.allowDateRe)),
                n.highlightedDates &&
                  e.isArray(n.highlightedDates) &&
                  n.highlightedDates.length &&
                  (e.each(n.highlightedDates, function (a, n) {
                    var i,
                      s = e.map(n.split(","), e.trim),
                      u = new t(r.parseDate(s[0], C.formatDate), s[1], s[2]),
                      d = r.formatDate(u.date, C.formatDate)
                    void 0 !== o[d]
                      ? (i = o[d].desc) &&
                        i.length &&
                        u.desc &&
                        u.desc.length &&
                        (o[d].desc = i + "\n" + u.desc)
                      : (o[d] = u)
                  }),
                  (C.highlightedDates = e.extend(!0, [], o))),
                n.highlightedPeriods &&
                  e.isArray(n.highlightedPeriods) &&
                  n.highlightedPeriods.length &&
                  ((o = e.extend(!0, [], C.highlightedDates)),
                  e.each(n.highlightedPeriods, function (a, n) {
                    var i, s, u, d, l, f, c
                    if (e.isArray(n))
                      (i = n[0]), (s = n[1]), (u = n[2]), (c = n[3])
                    else {
                      var m = e.map(n.split(","), e.trim)
                      ;(i = r.parseDate(m[0], C.formatDate)),
                        (s = r.parseDate(m[1], C.formatDate)),
                        (u = m[2]),
                        (c = m[3])
                    }
                    for (; i <= s; )
                      (d = new t(i, u, c)),
                        (l = r.formatDate(i, C.formatDate)),
                        i.setDate(i.getDate() + 1),
                        void 0 !== o[l]
                          ? (f = o[l].desc) &&
                            f.length &&
                            d.desc &&
                            d.desc.length &&
                            (o[l].desc = f + "\n" + d.desc)
                          : (o[l] = d)
                  }),
                  (C.highlightedDates = e.extend(!0, [], o))),
                n.disabledDates &&
                  e.isArray(n.disabledDates) &&
                  n.disabledDates.length &&
                  (C.disabledDates = e.extend(!0, [], n.disabledDates)),
                n.disabledWeekDays &&
                  e.isArray(n.disabledWeekDays) &&
                  n.disabledWeekDays.length &&
                  (C.disabledWeekDays = e.extend(!0, [], n.disabledWeekDays)),
                (!C.open && !C.opened) || C.inline || a.trigger("open.xdsoft"),
                C.inline &&
                  ((U = !0), j.addClass("xdsoft_inline"), a.after(j).hide()),
                C.inverseButton &&
                  ((C.next = "xdsoft_prev"), (C.prev = "xdsoft_next")),
                C.datepicker ? z.addClass("active") : z.removeClass("active"),
                C.timepicker ? L.addClass("active") : L.removeClass("active"),
                C.value &&
                  (A.setCurrentTime(C.value), a && a.val && a.val(A.str)),
                isNaN(C.dayOfWeekStart)
                  ? (C.dayOfWeekStart = 0)
                  : (C.dayOfWeekStart = parseInt(C.dayOfWeekStart, 10) % 7),
                C.timepickerScrollbar || E.xdsoftScroller(C, "hide"),
                C.minDate &&
                  /^[\+\-](.*)$/.test(C.minDate) &&
                  (C.minDate = r.formatDate(
                    A.strToDateTime(C.minDate),
                    C.formatDate
                  )),
                C.maxDate &&
                  /^[\+\-](.*)$/.test(C.maxDate) &&
                  (C.maxDate = r.formatDate(
                    A.strToDateTime(C.maxDate),
                    C.formatDate
                  )),
                C.minDateTime &&
                  /^\+(.*)$/.test(C.minDateTime) &&
                  (C.minDateTime = A.strToDateTime(C.minDateTime).dateFormat(
                    C.formatDate
                  )),
                C.maxDateTime &&
                  /^\+(.*)$/.test(C.maxDateTime) &&
                  (C.maxDateTime = A.strToDateTime(C.maxDateTime).dateFormat(
                    C.formatDate
                  )),
                V.toggle(C.showApplyButton),
                I.find(".xdsoft_today_button").css(
                  "visibility",
                  C.todayButton ? "visible" : "hidden"
                ),
                I.find("." + C.prev).css(
                  "visibility",
                  C.prevButton ? "visible" : "hidden"
                ),
                I.find("." + C.next).css(
                  "visibility",
                  C.nextButton ? "visible" : "hidden"
                ),
                s(C),
                C.validateOnBlur &&
                  a.off("blur.xdsoft").on("blur.xdsoft", function () {
                    if (
                      C.allowBlank &&
                      (!e.trim(e(this).val()).length ||
                        ("string" == typeof C.mask &&
                          e.trim(e(this).val()) ===
                            C.mask.replace(/[0-9]/g, "_")))
                    )
                      e(this).val(null), j.data("xdsoft_datetime").empty()
                    else {
                      var t = r.parseDate(e(this).val(), C.format)
                      if (t) e(this).val(r.formatDate(t, C.format))
                      else {
                        var a = +[e(this).val()[0], e(this).val()[1]].join(""),
                          n = +[e(this).val()[2], e(this).val()[3]].join("")
                        !C.datepicker &&
                        C.timepicker &&
                        a >= 0 &&
                        a < 24 &&
                        n >= 0 &&
                        n < 60
                          ? e(this).val(
                              [a, n]
                                .map(function (e) {
                                  return e > 9 ? e : "0" + e
                                })
                                .join(":")
                            )
                          : e(this).val(r.formatDate(A.now(), C.format))
                      }
                      j.data("xdsoft_datetime").setCurrentTime(e(this).val())
                    }
                    j.trigger("changedatetime.xdsoft"),
                      j.trigger("close.xdsoft")
                  }),
                (C.dayOfWeekStartPrev =
                  0 === C.dayOfWeekStart ? 6 : C.dayOfWeekStart - 1),
                j.trigger("xchange.xdsoft").trigger("afterOpen.xdsoft")
            }),
            j
              .data("options", C)
              .on("touchstart mousedown.xdsoft", function (e) {
                return (
                  e.stopPropagation(),
                  e.preventDefault(),
                  G.hide(),
                  B.hide(),
                  !1
                )
              }),
            E.append(R),
            E.xdsoftScroller(C),
            j.on("afterOpen.xdsoft", function () {
              E.xdsoftScroller(C)
            }),
            j.append(z).append(L),
            !0 !== C.withoutCopyright && j.append(J),
            z.append(I).append(N).append(V),
            e(C.parentID).append(j),
            (A = new (function () {
              var t = this
              ;(t.now = function (e) {
                var a,
                  r,
                  n = new Date()
                return (
                  !e &&
                    C.defaultDate &&
                    ((a = t.strToDateTime(C.defaultDate)),
                    n.setFullYear(a.getFullYear()),
                    n.setMonth(a.getMonth()),
                    n.setDate(a.getDate())),
                  n.setFullYear(n.getFullYear()),
                  !e &&
                    C.defaultTime &&
                    ((r = t.strtotime(C.defaultTime)),
                    n.setHours(r.getHours()),
                    n.setMinutes(r.getMinutes()),
                    n.setSeconds(r.getSeconds()),
                    n.setMilliseconds(r.getMilliseconds())),
                  n
                )
              }),
                (t.isValidDate = function (e) {
                  return (
                    "[object Date]" === Object.prototype.toString.call(e) &&
                    !isNaN(e.getTime())
                  )
                }),
                (t.setCurrentTime = function (e, a) {
                  "string" == typeof e
                    ? (t.currentTime = t.strToDateTime(e))
                    : t.isValidDate(e)
                    ? (t.currentTime = e)
                    : e || a || !C.allowBlank || C.inline
                    ? (t.currentTime = t.now())
                    : (t.currentTime = null),
                    j.trigger("xchange.xdsoft")
                }),
                (t.empty = function () {
                  t.currentTime = null
                }),
                (t.getCurrentTime = function () {
                  return t.currentTime
                }),
                (t.nextMonth = function () {
                  ;(void 0 !== t.currentTime && null !== t.currentTime) ||
                    (t.currentTime = t.now())
                  var a,
                    r = t.currentTime.getMonth() + 1
                  return (
                    12 === r &&
                      (t.currentTime.setFullYear(
                        t.currentTime.getFullYear() + 1
                      ),
                      (r = 0)),
                    (a = t.currentTime.getFullYear()),
                    t.currentTime.setDate(
                      Math.min(
                        new Date(
                          t.currentTime.getFullYear(),
                          r + 1,
                          0
                        ).getDate(),
                        t.currentTime.getDate()
                      )
                    ),
                    t.currentTime.setMonth(r),
                    C.onChangeMonth &&
                      e.isFunction(C.onChangeMonth) &&
                      C.onChangeMonth.call(j, A.currentTime, j.data("input")),
                    a !== t.currentTime.getFullYear() &&
                      e.isFunction(C.onChangeYear) &&
                      C.onChangeYear.call(j, A.currentTime, j.data("input")),
                    j.trigger("xchange.xdsoft"),
                    r
                  )
                }),
                (t.prevMonth = function () {
                  ;(void 0 !== t.currentTime && null !== t.currentTime) ||
                    (t.currentTime = t.now())
                  var a = t.currentTime.getMonth() - 1
                  return (
                    -1 === a &&
                      (t.currentTime.setFullYear(
                        t.currentTime.getFullYear() - 1
                      ),
                      (a = 11)),
                    t.currentTime.setDate(
                      Math.min(
                        new Date(
                          t.currentTime.getFullYear(),
                          a + 1,
                          0
                        ).getDate(),
                        t.currentTime.getDate()
                      )
                    ),
                    t.currentTime.setMonth(a),
                    C.onChangeMonth &&
                      e.isFunction(C.onChangeMonth) &&
                      C.onChangeMonth.call(j, A.currentTime, j.data("input")),
                    j.trigger("xchange.xdsoft"),
                    a
                  )
                }),
                (t.getWeekOfYear = function (t) {
                  if (C.onGetWeekOfYear && e.isFunction(C.onGetWeekOfYear)) {
                    var a = C.onGetWeekOfYear.call(j, t)
                    if (void 0 !== a) return a
                  }
                  var r = new Date(t.getFullYear(), 0, 1)
                  return (
                    4 !== r.getDay() &&
                      r.setMonth(0, 1 + ((4 - r.getDay() + 7) % 7)),
                    Math.ceil(((t - r) / 864e5 + r.getDay() + 1) / 7)
                  )
                }),
                (t.strToDateTime = function (e) {
                  var a,
                    n,
                    o = []
                  return e && e instanceof Date && t.isValidDate(e)
                    ? e
                    : ((o = /^([+-]{1})(.*)$/.exec(e)) &&
                        (o[2] = r.parseDate(o[2], C.formatDate)),
                      o && o[2]
                        ? ((a =
                            o[2].getTime() - 6e4 * o[2].getTimezoneOffset()),
                          (n = new Date(
                            t.now(!0).getTime() + parseInt(o[1] + "1", 10) * a
                          )))
                        : (n = e ? r.parseDate(e, C.format) : t.now()),
                      t.isValidDate(n) || (n = t.now()),
                      n)
                }),
                (t.strToDate = function (e) {
                  if (e && e instanceof Date && t.isValidDate(e)) return e
                  var a = e ? r.parseDate(e, C.formatDate) : t.now(!0)
                  return t.isValidDate(a) || (a = t.now(!0)), a
                }),
                (t.strtotime = function (e) {
                  if (e && e instanceof Date && t.isValidDate(e)) return e
                  var a = e ? r.parseDate(e, C.formatTime) : t.now(!0)
                  return t.isValidDate(a) || (a = t.now(!0)), a
                }),
                (t.str = function () {
                  var e = C.format
                  return (
                    C.yearOffset &&
                      (e = (e = e.replace(
                        "Y",
                        t.currentTime.getFullYear() + C.yearOffset
                      )).replace(
                        "y",
                        String(
                          t.currentTime.getFullYear() + C.yearOffset
                        ).substring(2, 4)
                      )),
                    r.formatDate(t.currentTime, e)
                  )
                }),
                (t.currentTime = this.now())
            })()),
            V.on("touchend click", function (e) {
              e.preventDefault(),
                j.data("changed", !0),
                A.setCurrentTime(i()),
                a.val(A.str()),
                j.trigger("close.xdsoft")
            }),
            I.find(".xdsoft_today_button")
              .on("touchend mousedown.xdsoft", function () {
                j.data("changed", !0),
                  A.setCurrentTime(0, !0),
                  j.trigger("afterOpen.xdsoft")
              })
              .on("dblclick.xdsoft", function () {
                var e,
                  t,
                  r = A.getCurrentTime()
                ;(r = new Date(r.getFullYear(), r.getMonth(), r.getDate())),
                  (e = A.strToDate(C.minDate)),
                  r <
                    (e = new Date(
                      e.getFullYear(),
                      e.getMonth(),
                      e.getDate()
                    )) ||
                    ((t = A.strToDate(C.maxDate)),
                    r >
                      (t = new Date(
                        t.getFullYear(),
                        t.getMonth(),
                        t.getDate()
                      )) ||
                      (a.val(A.str()),
                      a.trigger("change"),
                      j.trigger("close.xdsoft")))
              }),
            I.find(".xdsoft_prev,.xdsoft_next").on(
              "touchend mousedown.xdsoft",
              function () {
                var t = e(this),
                  a = 0,
                  r = !1
                !(function e(n) {
                  t.hasClass(C.next)
                    ? A.nextMonth()
                    : t.hasClass(C.prev) && A.prevMonth(),
                    C.monthChangeSpinner && (r || (a = setTimeout(e, n || 100)))
                })(500),
                  e([C.ownerDocument.body, C.contentWindow]).on(
                    "touchend mouseup.xdsoft",
                    function t() {
                      clearTimeout(a),
                        (r = !0),
                        e([C.ownerDocument.body, C.contentWindow]).off(
                          "touchend mouseup.xdsoft",
                          t
                        )
                    }
                  )
              }
            ),
            L.find(".xdsoft_prev,.xdsoft_next").on(
              "touchend mousedown.xdsoft",
              function () {
                var t = e(this),
                  a = 0,
                  r = !1,
                  n = 110
                !(function e(o) {
                  var i = E[0].clientHeight,
                    s = R[0].offsetHeight,
                    u = Math.abs(parseInt(R.css("marginTop"), 10))
                  t.hasClass(C.next) && s - i - C.timeHeightInTimePicker >= u
                    ? R.css(
                        "marginTop",
                        "-" + (u + C.timeHeightInTimePicker) + "px"
                      )
                    : t.hasClass(C.prev) &&
                      u - C.timeHeightInTimePicker >= 0 &&
                      R.css(
                        "marginTop",
                        "-" + (u - C.timeHeightInTimePicker) + "px"
                      ),
                    E.trigger("scroll_element.xdsoft_scroller", [
                      Math.abs(parseInt(R[0].style.marginTop, 10) / (s - i)),
                    ]),
                    (n = n > 10 ? 10 : n - 10),
                    r || (a = setTimeout(e, o || n))
                })(500),
                  e([C.ownerDocument.body, C.contentWindow]).on(
                    "touchend mouseup.xdsoft",
                    function t() {
                      clearTimeout(a),
                        (r = !0),
                        e([C.ownerDocument.body, C.contentWindow]).off(
                          "touchend mouseup.xdsoft",
                          t
                        )
                    }
                  )
              }
            ),
            (u = 0),
            j
              .on("xchange.xdsoft", function (t) {
                clearTimeout(u),
                  (u = setTimeout(function () {
                    ;(void 0 !== A.currentTime && null !== A.currentTime) ||
                      (A.currentTime = A.now())
                    for (
                      var t,
                        i,
                        s,
                        u,
                        d,
                        l,
                        f,
                        c,
                        m,
                        h,
                        g = "",
                        p = new Date(
                          A.currentTime.getFullYear(),
                          A.currentTime.getMonth(),
                          1,
                          12,
                          0,
                          0
                        ),
                        D = 0,
                        v = A.now(),
                        y = !1,
                        b = !1,
                        k = !1,
                        x = !1,
                        T = [],
                        S = !0,
                        M = "";
                      p.getDay() !== C.dayOfWeekStart;

                    )
                      p.setDate(p.getDate() - 1)
                    for (
                      g += "<table><thead><tr>",
                        C.weeks && (g += "<th></th>"),
                        t = 0;
                      t < 7;
                      t += 1
                    )
                      g +=
                        "<th>" +
                        C.i18n[o].dayOfWeekShort[(t + C.dayOfWeekStart) % 7] +
                        "</th>"
                    ;(g += "</tr></thead>"),
                      (g += "<tbody>"),
                      !1 !== C.maxDate &&
                        ((y = A.strToDate(C.maxDate)),
                        (y = new Date(
                          y.getFullYear(),
                          y.getMonth(),
                          y.getDate(),
                          23,
                          59,
                          59,
                          999
                        ))),
                      !1 !== C.minDate &&
                        ((b = A.strToDate(C.minDate)),
                        (b = new Date(
                          b.getFullYear(),
                          b.getMonth(),
                          b.getDate()
                        ))),
                      !1 !== C.minDateTime &&
                        ((k = A.strToDate(C.minDateTime)),
                        (k = new Date(
                          k.getFullYear(),
                          k.getMonth(),
                          k.getDate(),
                          k.getHours(),
                          k.getMinutes(),
                          k.getSeconds()
                        ))),
                      !1 !== C.maxDateTime &&
                        ((x = A.strToDate(C.maxDateTime)),
                        (x = new Date(
                          x.getFullYear(),
                          x.getMonth(),
                          x.getDate(),
                          x.getHours(),
                          x.getMinutes(),
                          x.getSeconds()
                        )))
                    var w
                    for (
                      !1 !== x &&
                      (w =
                        31 * (12 * x.getFullYear() + x.getMonth()) +
                        x.getDate());
                      D < A.currentTime.countDaysInMonth() ||
                      p.getDay() !== C.dayOfWeekStart ||
                      A.currentTime.getMonth() === p.getMonth();

                    ) {
                      ;(T = []),
                        (D += 1),
                        (s = p.getDay()),
                        (u = p.getDate()),
                        (d = p.getFullYear()),
                        (l = p.getMonth()),
                        (f = A.getWeekOfYear(p)),
                        (h = ""),
                        T.push("xdsoft_date"),
                        (c =
                          C.beforeShowDay && e.isFunction(C.beforeShowDay.call)
                            ? C.beforeShowDay.call(j, p)
                            : null),
                        C.allowDateRe &&
                          "[object RegExp]" ===
                            Object.prototype.toString.call(C.allowDateRe) &&
                          (C.allowDateRe.test(r.formatDate(p, C.formatDate)) ||
                            T.push("xdsoft_disabled")),
                        C.allowDates &&
                          C.allowDates.length > 0 &&
                          -1 ===
                            C.allowDates.indexOf(
                              r.formatDate(p, C.formatDate)
                            ) &&
                          T.push("xdsoft_disabled")
                      var O =
                        31 * (12 * p.getFullYear() + p.getMonth()) + p.getDate()
                      ;((!1 !== y && p > y) ||
                        (!1 !== k && p < k) ||
                        (!1 !== b && p < b) ||
                        (!1 !== x && O > w) ||
                        (c && !1 === c[0])) &&
                        T.push("xdsoft_disabled"),
                        -1 !==
                          C.disabledDates.indexOf(
                            r.formatDate(p, C.formatDate)
                          ) && T.push("xdsoft_disabled"),
                        -1 !== C.disabledWeekDays.indexOf(s) &&
                          T.push("xdsoft_disabled"),
                        a.is("[disabled]") && T.push("xdsoft_disabled"),
                        c && "" !== c[1] && T.push(c[1]),
                        A.currentTime.getMonth() !== l &&
                          T.push("xdsoft_other_month"),
                        (C.defaultSelect || j.data("changed")) &&
                          r.formatDate(A.currentTime, C.formatDate) ===
                            r.formatDate(p, C.formatDate) &&
                          T.push("xdsoft_current"),
                        r.formatDate(v, C.formatDate) ===
                          r.formatDate(p, C.formatDate) &&
                          T.push("xdsoft_today"),
                        (0 !== p.getDay() &&
                          6 !== p.getDay() &&
                          -1 ===
                            C.weekends.indexOf(
                              r.formatDate(p, C.formatDate)
                            )) ||
                          T.push("xdsoft_weekend"),
                        void 0 !==
                          C.highlightedDates[r.formatDate(p, C.formatDate)] &&
                          ((i =
                            C.highlightedDates[r.formatDate(p, C.formatDate)]),
                          T.push(
                            void 0 === i.style
                              ? "xdsoft_highlighted_default"
                              : i.style
                          ),
                          (h = void 0 === i.desc ? "" : i.desc)),
                        C.beforeShowDay &&
                          e.isFunction(C.beforeShowDay) &&
                          T.push(C.beforeShowDay(p)),
                        S &&
                          ((g += "<tr>"),
                          (S = !1),
                          C.weeks && (g += "<th>" + f + "</th>")),
                        (g +=
                          '<td data-date="' +
                          u +
                          '" data-month="' +
                          l +
                          '" data-year="' +
                          d +
                          '" class="xdsoft_date xdsoft_day_of_week' +
                          p.getDay() +
                          " " +
                          T.join(" ") +
                          '" title="' +
                          h +
                          '"><div>' +
                          u +
                          "</div></td>"),
                        p.getDay() === C.dayOfWeekStartPrev &&
                          ((g += "</tr>"), (S = !0)),
                        p.setDate(u + 1)
                    }
                    ;(g += "</tbody></table>"),
                      N.html(g),
                      I.find(".xdsoft_label span")
                        .eq(0)
                        .text(C.i18n[o].months[A.currentTime.getMonth()]),
                      I.find(".xdsoft_label span")
                        .eq(1)
                        .text(A.currentTime.getFullYear() + C.yearOffset),
                      (M = ""),
                      (l = "")
                    var W = 0
                    if (!1 !== C.minTime) {
                      F = A.strtotime(C.minTime)
                      W = 60 * F.getHours() + F.getMinutes()
                    }
                    var _ = 1440
                    if (!1 !== C.maxTime) {
                      F = A.strtotime(C.maxTime)
                      _ = 60 * F.getHours() + F.getMinutes()
                    }
                    if (!1 !== C.minDateTime) {
                      F = A.strToDateTime(C.minDateTime)
                      r.formatDate(A.currentTime, C.formatDate) ===
                        r.formatDate(F, C.formatDate) &&
                        (l = 60 * F.getHours() + F.getMinutes()) > W &&
                        (W = l)
                    }
                    if (!1 !== C.maxDateTime) {
                      var F = A.strToDateTime(C.maxDateTime)
                      r.formatDate(A.currentTime, C.formatDate) ===
                        r.formatDate(F, C.formatDate) &&
                        (l = 60 * F.getHours() + F.getMinutes()) < _ &&
                        (_ = l)
                    }
                    if (
                      ((m = function (t, n) {
                        var o,
                          i = A.now(),
                          s =
                            C.allowTimes &&
                            e.isArray(C.allowTimes) &&
                            C.allowTimes.length
                        i.setHours(t),
                          (t = parseInt(i.getHours(), 10)),
                          i.setMinutes(n),
                          (n = parseInt(i.getMinutes(), 10)),
                          (T = [])
                        var u = 60 * t + n
                        ;(a.is("[disabled]") || u >= _ || u < W) &&
                          T.push("xdsoft_disabled"),
                          (o = new Date(A.currentTime)).setHours(
                            parseInt(A.currentTime.getHours(), 10)
                          ),
                          s ||
                            o.setMinutes(
                              Math[C.roundTime](
                                A.currentTime.getMinutes() / C.step
                              ) * C.step
                            ),
                          (C.initTime ||
                            C.defaultSelect ||
                            j.data("changed")) &&
                            o.getHours() === parseInt(t, 10) &&
                            ((!s && C.step > 59) ||
                              o.getMinutes() === parseInt(n, 10)) &&
                            (C.defaultSelect || j.data("changed")
                              ? T.push("xdsoft_current")
                              : C.initTime && T.push("xdsoft_init_time")),
                          parseInt(v.getHours(), 10) === parseInt(t, 10) &&
                            parseInt(v.getMinutes(), 10) === parseInt(n, 10) &&
                            T.push("xdsoft_today"),
                          (M +=
                            '<div class="xdsoft_time ' +
                            T.join(" ") +
                            '" data-hour="' +
                            t +
                            '" data-minute="' +
                            n +
                            '">' +
                            r.formatDate(i, C.formatTime) +
                            "</div>")
                      }),
                      C.allowTimes &&
                        e.isArray(C.allowTimes) &&
                        C.allowTimes.length)
                    )
                      for (D = 0; D < C.allowTimes.length; D += 1)
                        m(
                          A.strtotime(C.allowTimes[D]).getHours(),
                          (l = A.strtotime(C.allowTimes[D]).getMinutes())
                        )
                    else
                      for (D = 0, t = 0; D < (C.hours12 ? 12 : 24); D += 1)
                        for (t = 0; t < 60; t += C.step) {
                          var P = 60 * D + t
                          P < W ||
                            P >= _ ||
                            m(
                              (D < 10 ? "0" : "") + D,
                              (l = (t < 10 ? "0" : "") + t)
                            )
                        }
                    for (
                      R.html(M), n = "", D = parseInt(C.yearStart, 10);
                      D <= parseInt(C.yearEnd, 10);
                      D += 1
                    )
                      n +=
                        '<div class="xdsoft_option ' +
                        (A.currentTime.getFullYear() === D
                          ? "xdsoft_current"
                          : "") +
                        '" data-value="' +
                        D +
                        '">' +
                        (D + C.yearOffset) +
                        "</div>"
                    for (
                      G.children().eq(0).html(n),
                        D = parseInt(C.monthStart, 10),
                        n = "";
                      D <= parseInt(C.monthEnd, 10);
                      D += 1
                    )
                      n +=
                        '<div class="xdsoft_option ' +
                        (A.currentTime.getMonth() === D
                          ? "xdsoft_current"
                          : "") +
                        '" data-value="' +
                        D +
                        '">' +
                        C.i18n[o].months[D] +
                        "</div>"
                    B.children().eq(0).html(n), e(j).trigger("generate.xdsoft")
                  }, 10)),
                  t.stopPropagation()
              })
              .on("afterOpen.xdsoft", function () {
                if (C.timepicker) {
                  var e, t, a, r
                  R.find(".xdsoft_current").length
                    ? (e = ".xdsoft_current")
                    : R.find(".xdsoft_init_time").length &&
                      (e = ".xdsoft_init_time"),
                    e
                      ? ((t = E[0].clientHeight),
                        (a = R[0].offsetHeight) - t <
                          (r =
                            R.find(e).index() * C.timeHeightInTimePicker + 1) &&
                          (r = a - t),
                        E.trigger("scroll_element.xdsoft_scroller", [
                          parseInt(r, 10) / (a - t),
                        ]))
                      : E.trigger("scroll_element.xdsoft_scroller", [0])
                }
              }),
            (d = 0),
            N.on("touchend click.xdsoft", "td", function (t) {
              t.stopPropagation(), (d += 1)
              var r = e(this),
                n = A.currentTime
              if (
                ((void 0 !== n && null !== n) ||
                  ((A.currentTime = A.now()), (n = A.currentTime)),
                r.hasClass("xdsoft_disabled"))
              )
                return !1
              n.setDate(1),
                n.setFullYear(r.data("year")),
                n.setMonth(r.data("month")),
                n.setDate(r.data("date")),
                j.trigger("select.xdsoft", [n]),
                a.val(A.str()),
                C.onSelectDate &&
                  e.isFunction(C.onSelectDate) &&
                  C.onSelectDate.call(j, A.currentTime, j.data("input"), t),
                j.data("changed", !0),
                j.trigger("xchange.xdsoft"),
                j.trigger("changedatetime.xdsoft"),
                (d > 1 ||
                  !0 === C.closeOnDateSelect ||
                  (!1 === C.closeOnDateSelect && !C.timepicker)) &&
                  !C.inline &&
                  j.trigger("close.xdsoft"),
                setTimeout(function () {
                  d = 0
                }, 200)
            }),
            R.on("touchstart", "div", function (e) {
              this.touchMoved = !1
            })
              .on("touchmove", "div", X)
              .on("touchend click.xdsoft", "div", function (t) {
                if (!this.touchMoved) {
                  t.stopPropagation()
                  var a = e(this),
                    r = A.currentTime
                  if (
                    ((void 0 !== r && null !== r) ||
                      ((A.currentTime = A.now()), (r = A.currentTime)),
                    a.hasClass("xdsoft_disabled"))
                  )
                    return !1
                  r.setHours(a.data("hour")),
                    r.setMinutes(a.data("minute")),
                    j.trigger("select.xdsoft", [r]),
                    j.data("input").val(A.str()),
                    C.onSelectTime &&
                      e.isFunction(C.onSelectTime) &&
                      C.onSelectTime.call(j, A.currentTime, j.data("input"), t),
                    j.data("changed", !0),
                    j.trigger("xchange.xdsoft"),
                    j.trigger("changedatetime.xdsoft"),
                    !0 !== C.inline &&
                      !0 === C.closeOnTimeSelect &&
                      j.trigger("close.xdsoft")
                }
              }),
            z.on("mousewheel.xdsoft", function (e) {
              return (
                !C.scrollMonth ||
                (e.deltaY < 0 ? A.nextMonth() : A.prevMonth(), !1)
              )
            }),
            a.on("mousewheel.xdsoft", function (e) {
              return (
                !C.scrollInput ||
                (!C.datepicker && C.timepicker
                  ? ((P = R.find(".xdsoft_current").length
                      ? R.find(".xdsoft_current").eq(0).index()
                      : 0) +
                      e.deltaY >=
                      0 &&
                      P + e.deltaY < R.children().length &&
                      (P += e.deltaY),
                    R.children().eq(P).length &&
                      R.children().eq(P).trigger("mousedown"),
                    !1)
                  : C.datepicker && !C.timepicker
                  ? (z.trigger(e, [e.deltaY, e.deltaX, e.deltaY]),
                    a.val && a.val(A.str()),
                    j.trigger("changedatetime.xdsoft"),
                    !1)
                  : void 0)
              )
            }),
            j
              .on("changedatetime.xdsoft", function (t) {
                if (C.onChangeDateTime && e.isFunction(C.onChangeDateTime)) {
                  var a = j.data("input")
                  C.onChangeDateTime.call(j, A.currentTime, a, t),
                    delete C.value,
                    a.trigger("change")
                }
              })
              .on("generate.xdsoft", function () {
                C.onGenerate &&
                  e.isFunction(C.onGenerate) &&
                  C.onGenerate.call(j, A.currentTime, j.data("input")),
                  U && (j.trigger("afterOpen.xdsoft"), (U = !1))
              })
              .on("click.xdsoft", function (e) {
                e.stopPropagation()
              }),
            (P = 0),
            (H = function (e, t) {
              do {
                if (!(e = e.parentNode) || !1 === t(e)) break
              } while ("HTML" !== e.nodeName)
            }),
            (Y = function () {
              var t, a, r, n, o, i, s, u, d, l, f, c, m
              if (
                ((u = j.data("input")),
                (t = u.offset()),
                (a = u[0]),
                (l = "top"),
                (r = t.top + a.offsetHeight - 1),
                (n = t.left),
                (o = "absolute"),
                (d = e(C.contentWindow).width()),
                (c = e(C.contentWindow).height()),
                (m = e(C.contentWindow).scrollTop()),
                C.ownerDocument.documentElement.clientWidth - t.left <
                  z.parent().outerWidth(!0))
              ) {
                var h = z.parent().outerWidth(!0) - a.offsetWidth
                n -= h
              }
              "rtl" === u.parent().css("direction") &&
                (n -= j.outerWidth() - u.outerWidth()),
                C.fixed
                  ? ((r -= m),
                    (n -= e(C.contentWindow).scrollLeft()),
                    (o = "fixed"))
                  : ((s = !1),
                    H(a, function (e) {
                      return (
                        null !== e &&
                        ("fixed" ===
                        C.contentWindow
                          .getComputedStyle(e)
                          .getPropertyValue("position")
                          ? ((s = !0), !1)
                          : void 0)
                      )
                    }),
                    s
                      ? ((o = "fixed"),
                        r + j.outerHeight() > c + m
                          ? ((l = "bottom"), (r = c + m - t.top))
                          : (r -= m))
                      : r + j[0].offsetHeight > c + m &&
                        (r = t.top - j[0].offsetHeight + 1),
                    r < 0 && (r = 0),
                    n + a.offsetWidth > d && (n = d - a.offsetWidth)),
                (i = j[0]),
                H(i, function (e) {
                  if (
                    "relative" ===
                      C.contentWindow
                        .getComputedStyle(e)
                        .getPropertyValue("position") &&
                    d >= e.offsetWidth
                  )
                    return (n -= (d - e.offsetWidth) / 2), !1
                }),
                ((f = { position: o, left: n, top: "", bottom: "" })[l] = r),
                j.css(f)
            }),
            j
              .on("open.xdsoft", function (t) {
                var a = !0
                C.onShow &&
                  e.isFunction(C.onShow) &&
                  (a = C.onShow.call(j, A.currentTime, j.data("input"), t)),
                  !1 !== a &&
                    (j.show(),
                    Y(),
                    e(C.contentWindow)
                      .off("resize.xdsoft", Y)
                      .on("resize.xdsoft", Y),
                    C.closeOnWithoutClick &&
                      e([C.ownerDocument.body, C.contentWindow]).on(
                        "touchstart mousedown.xdsoft",
                        function t() {
                          j.trigger("close.xdsoft"),
                            e([C.ownerDocument.body, C.contentWindow]).off(
                              "touchstart mousedown.xdsoft",
                              t
                            )
                        }
                      ))
              })
              .on("close.xdsoft", function (t) {
                var a = !0
                I.find(".xdsoft_month,.xdsoft_year")
                  .find(".xdsoft_select")
                  .hide(),
                  C.onClose &&
                    e.isFunction(C.onClose) &&
                    (a = C.onClose.call(j, A.currentTime, j.data("input"), t)),
                  !1 === a || C.opened || C.inline || j.hide(),
                  t.stopPropagation()
              })
              .on("toggle.xdsoft", function () {
                j.is(":visible")
                  ? j.trigger("close.xdsoft")
                  : j.trigger("open.xdsoft")
              })
              .data("input", a),
            (q = 0),
            j.data("xdsoft_datetime", A),
            j.setOptions(C),
            A.setCurrentTime(i()),
            a
              .data("xdsoft_datetimepicker", j)
              .on(
                "open.xdsoft focusin.xdsoft mousedown.xdsoft touchstart",
                function () {
                  a.is(":disabled") ||
                    (a.data("xdsoft_datetimepicker").is(":visible") &&
                      C.closeOnInputClick) ||
                    (C.openOnFocus &&
                      (clearTimeout(q),
                      (q = setTimeout(function () {
                        a.is(":disabled") ||
                          ((U = !0),
                          A.setCurrentTime(i(), !0),
                          C.mask && s(C),
                          j.trigger("open.xdsoft"))
                      }, 100))))
                }
              )
              .on("keydown.xdsoft", function (t) {
                var a,
                  r = t.which
                return -1 !== [p].indexOf(r) && C.enterLikeTab
                  ? ((a = e(
                      "input:visible,textarea:visible,button:visible,a:visible"
                    )),
                    j.trigger("close.xdsoft"),
                    a.eq(a.index(this) + 1).focus(),
                    !1)
                  : -1 !== [T].indexOf(r)
                  ? (j.trigger("close.xdsoft"), !0)
                  : void 0
              })
              .on("blur.xdsoft", function () {
                j.trigger("close.xdsoft")
              })
        }),
        (u = function (t) {
          var a = t.data("xdsoft_datetimepicker")
          a &&
            (a.data("xdsoft_datetime", null),
            a.remove(),
            t.data("xdsoft_datetimepicker", null).off(".xdsoft"),
            e(C.contentWindow).off("resize.xdsoft"),
            e([C.contentWindow, C.ownerDocument.body]).off(
              "mousedown.xdsoft touchstart"
            ),
            t.unmousewheel && t.unmousewheel())
        }),
        e(C.ownerDocument)
          .off("keydown.xdsoftctrl keyup.xdsoftctrl")
          .on("keydown.xdsoftctrl", function (e) {
            e.keyCode === h && (F = !0)
          })
          .on("keyup.xdsoftctrl", function (e) {
            e.keyCode === h && (F = !1)
          }),
        this.each(function () {
          var t = e(this).data("xdsoft_datetimepicker")
          if (t) {
            if ("string" === e.type(n))
              switch (n) {
                case "show":
                  e(this).select().focus(), t.trigger("open.xdsoft")
                  break
                case "hide":
                  t.trigger("close.xdsoft")
                  break
                case "toggle":
                  t.trigger("toggle.xdsoft")
                  break
                case "destroy":
                  u(e(this))
                  break
                case "reset":
                  ;(this.value = this.defaultValue),
                    (this.value &&
                      t
                        .data("xdsoft_datetime")
                        .isValidDate(r.parseDate(this.value, C.format))) ||
                      t.data("changed", !1),
                    t.data("xdsoft_datetime").setCurrentTime(this.value)
                  break
                case "validate":
                  t.data("input").trigger("blur.xdsoft")
                  break
                default:
                  t[n] && e.isFunction(t[n]) && (d = t[n](i))
              }
            else t.setOptions(n)
            return 0
          }
          "string" !== e.type(n) &&
            (!C.lazyInit || C.open || C.inline ? s(e(this)) : Y(e(this)))
        }),
        d
      )
    }),
    (e.fn.datetimepicker.defaults = a)
}
!(function (e) {
  "function" == typeof define && define.amd
    ? define(["jquery", "jquery-mousewheel"], e)
    : "object" == typeof exports
    ? (module.exports = e(require("jquery")))
    : e(jQuery)
})(datetimepickerFactory),
  (function (e) {
    "function" == typeof define && define.amd
      ? define(["jquery"], e)
      : "object" == typeof exports
      ? (module.exports = e)
      : e(jQuery)
  })(function (e) {
    function t(t) {
      var i = t || window.event,
        s = u.call(arguments, 1),
        d = 0,
        f = 0,
        c = 0,
        m = 0,
        h = 0,
        g = 0
      if (
        ((t = e.event.fix(i)),
        (t.type = "mousewheel"),
        "detail" in i && (c = -1 * i.detail),
        "wheelDelta" in i && (c = i.wheelDelta),
        "wheelDeltaY" in i && (c = i.wheelDeltaY),
        "wheelDeltaX" in i && (f = -1 * i.wheelDeltaX),
        "axis" in i && i.axis === i.HORIZONTAL_AXIS && ((f = -1 * c), (c = 0)),
        (d = 0 === c ? f : c),
        "deltaY" in i && (d = c = -1 * i.deltaY),
        "deltaX" in i && ((f = i.deltaX), 0 === c && (d = -1 * f)),
        0 !== c || 0 !== f)
      ) {
        if (1 === i.deltaMode) {
          var p = e.data(this, "mousewheel-line-height")
          ;(d *= p), (c *= p), (f *= p)
        } else if (2 === i.deltaMode) {
          var D = e.data(this, "mousewheel-page-height")
          ;(d *= D), (c *= D), (f *= D)
        }
        if (
          ((m = Math.max(Math.abs(c), Math.abs(f))),
          (!o || m < o) && ((o = m), r(i, m) && (o /= 40)),
          r(i, m) && ((d /= 40), (f /= 40), (c /= 40)),
          (d = Math[d >= 1 ? "floor" : "ceil"](d / o)),
          (f = Math[f >= 1 ? "floor" : "ceil"](f / o)),
          (c = Math[c >= 1 ? "floor" : "ceil"](c / o)),
          l.settings.normalizeOffset && this.getBoundingClientRect)
        ) {
          var v = this.getBoundingClientRect()
          ;(h = t.clientX - v.left), (g = t.clientY - v.top)
        }
        return (
          (t.deltaX = f),
          (t.deltaY = c),
          (t.deltaFactor = o),
          (t.offsetX = h),
          (t.offsetY = g),
          (t.deltaMode = 0),
          s.unshift(t, d, f, c),
          n && clearTimeout(n),
          (n = setTimeout(a, 200)),
          (e.event.dispatch || e.event.handle).apply(this, s)
        )
      }
    }
    function a() {
      o = null
    }
    function r(e, t) {
      return (
        l.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
      )
    }
    var n,
      o,
      i = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
      s =
        "onwheel" in document || document.documentMode >= 9
          ? ["wheel"]
          : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
      u = Array.prototype.slice
    if (e.event.fixHooks)
      for (var d = i.length; d; ) e.event.fixHooks[i[--d]] = e.event.mouseHooks
    var l = (e.event.special.mousewheel = {
      version: "3.1.12",
      setup: function () {
        if (this.addEventListener)
          for (var a = s.length; a; ) this.addEventListener(s[--a], t, !1)
        else this.onmousewheel = t
        e.data(this, "mousewheel-line-height", l.getLineHeight(this)),
          e.data(this, "mousewheel-page-height", l.getPageHeight(this))
      },
      teardown: function () {
        if (this.removeEventListener)
          for (var a = s.length; a; ) this.removeEventListener(s[--a], t, !1)
        else this.onmousewheel = null
        e.removeData(this, "mousewheel-line-height"),
          e.removeData(this, "mousewheel-page-height")
      },
      getLineHeight: function (t) {
        var a = e(t),
          r = a["offsetParent" in e.fn ? "offsetParent" : "parent"]()
        return (
          r.length || (r = e("body")),
          parseInt(r.css("fontSize"), 10) ||
            parseInt(a.css("fontSize"), 10) ||
            16
        )
      },
      getPageHeight: function (t) {
        return e(t).height()
      },
      settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
    })
    e.fn.extend({
      mousewheel: function (e) {
        return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
      },
      unmousewheel: function (e) {
        return this.unbind("mousewheel", e)
      },
    })
  })
