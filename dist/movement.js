"use strict";

// The outlines are traced from the original photos in a 766 × 510 viewBox.
// Rotate the cut-out limbs around the visible elbow or shoulder for the alternate pose.
const signalMovements = {
  215: {
    arms: [{
      outline: "M193 153 Q196 121 205 91 L211 76 Q209 63 219 46 L227 23 Q231 12 237 19 Q244 7 251 16 Q261 8 265 18 Q273 19 269 32 L264 64 Q281 47 281 64 L262 88 Q253 100 247 104 L243 153 Q234 180 208 178Z",
      transform: "rotate(-33 215 167)"
    }],
    arrows: ["M262 100 C236 123 159 123 135 95 C103 56 165 22 228 26 C279 27 310 47 304 70"]
  },
  216: {
    arms: [{
      outline: "M310 162 Q285 174 263 232 L220 293 Q192 339 179 367 L154 406 Q149 415 148 434 L142 464 Q141 478 147 480 Q152 491 158 484 Q169 493 173 481 L184 452 Q186 470 192 459 L204 421 L198 397 L219 368 Q244 337 266 302 L298 275 Q314 257 319 228Z",
      transform: "rotate(18 311 181)"
    }],
    arrows: ["M59 390 C76 375 130 393 174 427 C215 458 224 483 193 487 C152 491 99 461 68 427"]
  },
  225: {
    arms: [{
      outline: "M160 416 Q160 386 184 365 L221 342 Q227 333 226 302 Q227 277 239 280 Q252 280 250 313 L275 278 Q282 269 290 277 Q299 271 304 285 Q315 282 315 297 Q329 298 325 314 Q320 336 294 362 L267 382 Q258 411 236 447 Q215 480 185 470 Q159 460 158 440Z",
      transform: "translate(190 418) rotate(-20) scale(.79) translate(-190 -418)"
    }, {
      outline: "M471 423 Q470 393 490 364 L497 348 Q492 331 496 306 Q500 289 505 292 Q506 281 516 289 Q519 275 530 287 Q540 280 551 297 Q563 282 570 302 Q575 320 568 345 L564 370 Q566 397 549 420 Q521 454 490 465 L474 465Z",
      transform: "translate(504 420) rotate(24) scale(.83) translate(-504 -420)"
    }],
    arrows: [
      "M130 365 Q124 292 182 240",
      "M634 366 Q637 293 583 240"
    ]
  },
  226: {
    arms: [{
      outline: "M204 377 Q208 344 252 320 L276 300 Q279 283 286 271 L289 219 Q293 202 306 213 L312 243 L313 213 Q318 193 332 204 Q340 209 338 224 L335 248 L344 214 Q352 201 362 213 Q371 221 367 240 L363 267 L367 287 Q385 275 393 271 Q408 273 396 291 L365 325 Q352 341 328 346 Q304 384 261 394 Q233 400 204 377Z",
      transform: "translate(250 368) rotate(-26) scale(.76) translate(-250 -368)"
    }, {
      outline: "M498 347 Q498 323 501 319 L481 310 Q466 299 482 292 Q492 288 500 296 L504 237 Q506 215 518 224 L520 248 L522 222 Q526 205 538 212 Q545 212 545 232 L544 255 L550 226 Q558 214 568 226 L569 252 Q581 242 581 258 L575 287 L574 311 Q573 334 565 350 Q571 378 553 394 Q536 412 510 399 Q490 393 487 371Z",
      transform: "translate(505 371) rotate(26) scale(.76) translate(-505 -371)"
    }],
    arrows: [
      "M211 184 Q139 240 167 310",
      "M605 185 Q678 244 650 311"
    ]
  },
  227: {
    arms: [{
      outline: "M399 159 L379 162 Q336 167 294 177 L245 182 L178 184 L132 185 L99 189 L79 192 L35 197 Q27 200 36 206 L75 208 L98 214 L130 230 L183 241 L252 255 L319 260 L373 273 L396 266Z",
      transform: "rotate(11 394 207)"
    }],
    arrows: ["M283 139 Q168 116 57 142"]
  },
  228: {
    arms: [{
      outline: "M324 161 L348 161 L387 168 L438 174 L491 175 L553 175 L603 180 L640 183 L679 190 L717 195 Q728 202 718 207 L675 208 L647 215 L620 222 L604 232 L543 245 L478 255 L403 259 L348 275 L331 265Z",
      transform: "rotate(-11 334 206)"
    }],
    arrows: ["M473 138 Q596 115 705 141"]
  }
};

let movementImageCount = 0;

function movementOverlay(movement, photo) {
  // Multiple copies of a signal can be on the same page, including behind a dialog.
  const prefix = "movement-" + ++movementImageCount;
  const arms = movement.arms.map(({outline, transform}, index) => `
    <g transform="${transform}">
      <use href="#${prefix}-photo" clip-path="url(#${prefix}-arm-${index})"/>
      <path class="movement-outline" d="${outline}"/>
    </g>`).join("");
  const arrows = movement.arrows.map(path => `
    <path class="movement-line movement-edge" d="${path}"/>
    <path class="movement-line movement-arrow" d="${path}" marker-end="url(#${prefix}-arrow)"/>
    <circle class="movement-tracer" cx="0" cy="0" r="9" visibility="hidden">
      <animateMotion path="${path}" begin="0.15s" dur="1.7s" repeatCount="2"/>
      <set attributeName="visibility" to="visible" begin="0.15s" dur="3.4s"/>
    </circle>`).join("");
  return `
    <svg class="movement-overlay" viewBox="0 0 766 510" aria-hidden="true" focusable="false">
      <defs>
        <image id="${prefix}-photo" href="${photo}" width="766" height="510"/>
        ${movement.arms.map(({outline}, index) => `
          <clipPath id="${prefix}-arm-${index}"><path d="${outline}"/></clipPath>`).join("")}
        <marker id="${prefix}-arrow" viewBox="-3 -3 32 30" refX="23" refY="12"
          markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L24 12 L0 24 L4 12Z" fill="#ffdd58" stroke="#122941" stroke-width="2.2" stroke-linejoin="round"/>
        </marker>
      </defs>
      <g class="movement-poses">${arms}</g>
      ${arrows}
    </svg>`;
}

function signalPhoto(id, alt) {
  const photo = "./assets/" + id + ".webp";
  const movement = signalMovements[id];
  return `<span class="signal-photo">
    <img class="signalimg" src="${photo}" alt="${alt}">
    ${movement ? movementOverlay(movement, photo) : ""}
  </span>`;
}
