from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
import math

from PIL import Image, ImageDraw, ImageFont


WHITE = "#F8F8FA"
GOLD = "#D8A221"
MUTED_WHITE = "#F3F3F6"


@dataclass(frozen=True)
class CircuitLine:
    points: tuple[tuple[float, float], ...]
    nodes: tuple[int, ...] = ()
    width: int = 10


def mirror_x(point: tuple[float, float], cx: float) -> tuple[float, float]:
    x, y = point
    return (2 * cx - x, y)


def to_svg_polyline(points: Iterable[tuple[float, float]]) -> str:
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)


def sample_quadratic(p0, p1, p2, steps=14):
    pts = []
    for i in range(1, steps + 1):
        t = i / steps
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t**2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t**2 * p2[1]
        pts.append((x, y))
    return pts


def build_outer_half_points() -> list[tuple[float, float]]:
    # Orthogonal + curved silhouette approximating the uploaded brain-circuit mark.
    pts = [(252, 52), (220, 52), (196, 76), (196, 128), (164, 128)]
    pts += sample_quadratic((164, 128), (132, 130), (112, 154), 10)
    pts += [(100, 168), (100, 204), (72, 204)]
    pts += sample_quadratic((72, 204), (36, 206), (26, 238), 12)
    pts += sample_quadratic((26, 238), (14, 264), (28, 286), 10)
    pts += [(42, 300)]
    pts += sample_quadratic((42, 300), (18, 316), (20, 348), 12)
    pts += sample_quadratic((20, 348), (20, 390), (56, 408), 12)
    pts += [(64, 412), (64, 430)]
    pts += sample_quadratic((64, 430), (66, 468), (104, 482), 14)
    pts += [(144, 482), (172, 454), (172, 408), (196, 384), (196, 344), (224, 316), (224, 286)]
    pts += [(252, 258), (252, 194), (228, 170), (228, 142), (196, 110), (196, 82), (220, 58), (252, 58)]
    return pts


def build_circuit_lines_left() -> list[CircuitLine]:
    return [
        CircuitLine(points=((150, 92), (150, 120), (186, 156), (186, 192)), nodes=(0, 3), width=8),
        CircuitLine(points=((128, 100), (128, 150), (172, 194), (172, 250), (218, 296)), nodes=(0, 4), width=8),
        CircuitLine(points=((106, 146), (106, 188), (146, 228), (146, 252)), nodes=(0, 2, 3), width=8),
        CircuitLine(points=((86, 182), (86, 222), (124, 260), (200, 260)), nodes=(0, 1, 3), width=8),
        CircuitLine(points=((62, 222), (88, 248), (118, 248)), nodes=(0, 1, 2), width=8),
        CircuitLine(points=((56, 284), (84, 312), (126, 312)), nodes=(0, 1, 2), width=8),
        CircuitLine(points=((74, 330), (74, 360), (110, 360)), nodes=(0, 2), width=8),
        CircuitLine(points=((82, 388), (82, 434)), nodes=(0, 1), width=8),
        CircuitLine(points=((118, 350), (118, 408), (118, 440)), nodes=(0, 2), width=8),
        CircuitLine(points=((146, 396), (146, 460)), nodes=(0, 1), width=8),
        CircuitLine(points=((172, 390), (172, 430), (198, 456)), nodes=(0, 1, 2), width=8),
        CircuitLine(points=((210, 158), (210, 230), (236, 256)), nodes=(0, 2), width=8),
        CircuitLine(points=((210, 272), (236, 272)), nodes=(0, 1), width=8),
        CircuitLine(points=((210, 340), (210, 470)), nodes=(0, 1), width=8),
        CircuitLine(points=((232, 118), (232, 470)), nodes=(0, 1), width=10),
    ]


def build_mark_svg() -> str:
    cx = 256
    outer_left = build_outer_half_points()
    outer_right = [mirror_x(p, cx) for p in outer_left]
    lines_left = build_circuit_lines_left()

    svg_parts: list[str] = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">',
        '<g stroke="#F8F8FA" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">',
        f'<polyline points="{to_svg_polyline(outer_left)}" stroke-width="10"/>',
        f'<polyline points="{to_svg_polyline(outer_right)}" stroke-width="10"/>',
        '<line x1="246" y1="156" x2="246" y2="470" stroke-width="10"/>',
        '<line x1="266" y1="156" x2="266" y2="470" stroke-width="10"/>',
        '<line x1="246" y1="104" x2="246" y2="140" stroke-width="8"/>',
        '<line x1="266" y1="104" x2="266" y2="140" stroke-width="8"/>',
    ]

    for line in lines_left:
        svg_parts.append(
            f'<polyline points="{to_svg_polyline(line.points)}" stroke-width="{line.width}"/>'
        )
        mirrored = [mirror_x(p, cx) for p in line.points]
        svg_parts.append(
            f'<polyline points="{to_svg_polyline(mirrored)}" stroke-width="{line.width}"/>'
        )

    svg_parts.append('</g>')

    # Nodes
    node_radius_big = 7
    node_radius = 6
    svg_parts.append(f'<g fill="{WHITE}">')
    central_nodes = [(246, 164), (266, 164), (246, 248), (266, 248), (246, 362), (266, 362)]
    for x, y in central_nodes:
        svg_parts.append(f'<circle cx="{x}" cy="{y}" r="{node_radius_big}"/>')
    for line in lines_left:
        for idx in line.nodes:
            x, y = line.points[idx]
            svg_parts.append(f'<circle cx="{x}" cy="{y}" r="{node_radius}"/>')
            mx, my = mirror_x((x, y), cx)
            svg_parts.append(f'<circle cx="{mx}" cy="{my}" r="{node_radius}"/>')
    svg_parts.append('</g>')
    svg_parts.append('</svg>')
    return "".join(svg_parts)


def svg_text_multicolor_line(
    x_center: float,
    y_baseline: float,
    font_size: int,
    font_weight: int,
    letter_spacing: float,
) -> str:
    segments = [
        ("APPLIED ", WHITE),
        ("AI", GOLD),
        (" CLUB", WHITE),
    ]
    approx_width = 0.0
    glyph_factor = 0.62
    for text, _ in segments:
        approx_width += len(text) * font_size * glyph_factor
    approx_width += (sum(len(t) for t, _ in segments) - 1) * letter_spacing
    x = x_center - approx_width / 2

    out = ['<text xml:space="preserve" '
           f'x="{x:.1f}" y="{y_baseline:.1f}" '
           'font-family="Segoe UI, Inter, Arial, sans-serif" '
           f'font-size="{font_size}" font-weight="{font_weight}" '
           f'letter-spacing="{letter_spacing}" fill="{WHITE}">']
    for text, color in segments:
        out.append(f'<tspan fill="{color}">{text}</tspan>')
    out.append("</text>")
    return "".join(out)


def build_full_logo_svg() -> str:
    # Stacked lockup based on the uploaded mark + two-line wordmark.
    mark_size = 360
    mark_x = 480 - mark_size / 2
    mark_y = 34
    top_rule_y = 432
    bottom_rule_y = 610
    left_rule_x = 86
    right_rule_x = 874
    rule_stroke = 6
    rule_radius = 10

    mark_svg = build_mark_svg()
    # Extract inner content from mark SVG.
    inner = mark_svg[mark_svg.find(">") + 1 : mark_svg.rfind("</svg>")]

    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 700" fill="none">',
        f'<g transform="translate({mark_x:.1f} {mark_y:.1f}) scale({mark_size/512:.6f})">',
        inner,
        "</g>",
        f'<g stroke="{GOLD}" stroke-width="{rule_stroke}" stroke-linecap="round" shape-rendering="geometricPrecision">',
        f'<line x1="{left_rule_x}" y1="{top_rule_y}" x2="{right_rule_x}" y2="{top_rule_y}"/>',
        f'<line x1="{left_rule_x}" y1="{bottom_rule_y}" x2="{right_rule_x}" y2="{bottom_rule_y}"/>',
        "</g>",
        f'<g fill="{GOLD}">',
        f'<circle cx="{left_rule_x}" cy="{top_rule_y}" r="{rule_radius}"/>',
        f'<circle cx="{right_rule_x}" cy="{top_rule_y}" r="{rule_radius}"/>',
        f'<circle cx="{left_rule_x}" cy="{bottom_rule_y}" r="{rule_radius}"/>',
        f'<circle cx="{right_rule_x}" cy="{bottom_rule_y}" r="{rule_radius}"/>',
        "</g>",
        svg_text_multicolor_line(480, 530, 72, 700, 1.2),
        '<text x="480" y="584" text-anchor="middle" '
        'font-family="Segoe UI, Inter, Arial, sans-serif" '
        'font-size="34" font-weight="500" letter-spacing="1.2" '
        f'fill="{MUTED_WHITE}">PURDUE UNIVERSITY NORTHWEST</text>',
        "</svg>",
    ]
    return "".join(parts)


def _font_candidates(*paths: str) -> ImageFont.FreeTypeFont:
    for path in paths:
        p = Path(path)
        if p.exists():
            return ImageFont.truetype(str(p), size=10)
    raise FileNotFoundError("No suitable system font found")


def _load_font(path_candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in path_candidates:
        p = Path(path)
        if p.exists():
            return ImageFont.truetype(str(p), size=size)
    # Pillow fallback
    return ImageFont.load_default()


def draw_polyline(draw: ImageDraw.ImageDraw, pts: list[tuple[float, float]], scale: float, offset: tuple[float, float], fill, width: int):
    mapped = [(offset[0] + x * scale, offset[1] + y * scale) for x, y in pts]
    draw.line(mapped, fill=fill, width=max(1, round(width * scale)), joint="curve")


def draw_mark_png(draw: ImageDraw.ImageDraw, offset: tuple[float, float], size: float):
    cx = 256
    scale = size / 512
    outer_left = build_outer_half_points()
    outer_right = [mirror_x(p, cx) for p in outer_left]
    lines_left = build_circuit_lines_left()

    # Stroke drawing order
    draw_polyline(draw, outer_left, scale, offset, WHITE, 10)
    draw_polyline(draw, outer_right, scale, offset, WHITE, 10)

    for seg in [
        [(246, 156), (246, 470)],
        [(266, 156), (266, 470)],
        [(246, 104), (246, 140)],
        [(266, 104), (266, 140)],
    ]:
        draw_polyline(draw, seg, scale, offset, WHITE, 10 if len(seg) == 2 and seg[0][0] in (246, 266) and seg[0][1] == 156 else 8)

    for line in lines_left:
        draw_polyline(draw, list(line.points), scale, offset, WHITE, line.width)
        draw_polyline(draw, [mirror_x(p, cx) for p in line.points], scale, offset, WHITE, line.width)

    # Nodes
    central_nodes = [(246, 164), (266, 164), (246, 248), (266, 248), (246, 362), (266, 362)]
    r_big = 7 * scale
    r = 6 * scale
    for x, y in central_nodes:
        xx, yy = offset[0] + x * scale, offset[1] + y * scale
        draw.ellipse((xx - r_big, yy - r_big, xx + r_big, yy + r_big), fill=WHITE)

    for line in lines_left:
        for idx in line.nodes:
            for p in (line.points[idx], mirror_x(line.points[idx], cx)):
                xx, yy = offset[0] + p[0] * scale, offset[1] + p[1] * scale
                draw.ellipse((xx - r, yy - r, xx + r, yy + r), fill=WHITE)


def draw_full_logo_png(out_path: Path, width: int = 1920, height: int = 1400):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale from SVG viewBox 960x700
    sx = width / 960
    sy = height / 700
    s = min(sx, sy)
    ox = (width - 960 * s) / 2
    oy = (height - 700 * s) / 2

    def map_pt(x: float, y: float):
        return ox + x * s, oy + y * s

    # Mark
    mark_size = 360 * s
    mark_x = ox + 300 * s
    mark_y = oy + 34 * s
    draw_mark_png(draw, (mark_x, mark_y), mark_size)

    # Gold rules + endpoints
    gold_rgba = (216, 162, 33, 255)
    rule_w = max(1, round(6 * s))
    for y in (432, 610):
        draw.line([map_pt(86, y), map_pt(874, y)], fill=gold_rgba, width=rule_w)
    rr = 10 * s
    for x, y in ((86, 432), (874, 432), (86, 610), (874, 610)):
        xx, yy = map_pt(x, y)
        draw.ellipse((xx - rr, yy - rr, xx + rr, yy + rr), fill=gold_rgba)

    # Text fonts
    bold = _load_font(
        [
            r"C:\Windows\Fonts\segoeuib.ttf",
            r"C:\Windows\Fonts\arialbd.ttf",
        ],
        max(12, round(72 * s)),
    )
    regular = _load_font(
        [
            r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arial.ttf",
        ],
        max(12, round(34 * s)),
    )

    def text_length(text: str, font: ImageFont.FreeTypeFont, tracking: float) -> float:
        total = 0.0
        for i, ch in enumerate(text):
            bbox = draw.textbbox((0, 0), ch, font=font)
            total += bbox[2] - bbox[0]
            if i < len(text) - 1:
                total += tracking
        return total

    def draw_tracked_text(x: float, y: float, text: str, font, fill, tracking: float):
        cx = x
        for i, ch in enumerate(text):
            draw.text((cx, y), ch, font=font, fill=fill)
            bbox = draw.textbbox((cx, y), ch, font=font)
            cx += (bbox[2] - bbox[0]) + (tracking if i < len(text) - 1 else 0)
        return cx

    line1_y = oy + 530 * s - round(72 * s)
    tracking1 = 1.2 * s
    seg1 = "APPLIED "
    seg2 = "AI"
    seg3 = " CLUB"
    w1 = text_length(seg1, bold, tracking1)
    w2 = text_length(seg2, bold, tracking1)
    w3 = text_length(seg3, bold, tracking1)
    start_x = ox + 480 * s - (w1 + w2 + w3) / 2
    cur = draw_tracked_text(start_x, line1_y, seg1, bold, WHITE, tracking1)
    cur = draw_tracked_text(cur, line1_y, seg2, bold, gold_rgba, tracking1)
    draw_tracked_text(cur, line1_y, seg3, bold, WHITE, tracking1)

    subtitle = "PURDUE UNIVERSITY NORTHWEST"
    tracking2 = 1.2 * s
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=regular)
    subtitle_w = text_length(subtitle, regular, tracking2)
    subtitle_x = ox + 480 * s - subtitle_w / 2
    subtitle_y = oy + 584 * s - (subtitle_bbox[3] - subtitle_bbox[1])
    draw_tracked_text(subtitle_x, subtitle_y, subtitle, regular, (243, 243, 246, 255), tracking2)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG", optimize=True)


def main():
    repo = Path(__file__).resolve().parents[1]
    brand_dir = repo / "public" / "assets" / "brand"
    brand_dir.mkdir(parents=True, exist_ok=True)

    mark_svg_path = brand_dir / "applied-ai-mark.svg"
    full_svg_path = brand_dir / "applied-ai-club-logo.svg"
    full_png_path = brand_dir / "applied-ai-club-logo.png"

    mark_svg_path.write_text(build_mark_svg(), encoding="utf-8")
    full_svg_path.write_text(build_full_logo_svg(), encoding="utf-8")
    draw_full_logo_png(full_png_path)

    print(f"Wrote {mark_svg_path}")
    print(f"Wrote {full_svg_path}")
    print(f"Wrote {full_png_path}")


if __name__ == "__main__":
    main()
