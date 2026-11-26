# Blender script: "Shararti Bakri Chamki" 60-second 3D animated story.
# Run: xvfb-run -a blender -b -P chamki_scene.py -- <out_dir> [start] [end]
import bpy, math, random, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "/tmp/chamki_frames"
FSTART = int(argv[1]) if len(argv) > 1 else 1
FEND = int(argv[2]) if len(argv) > 2 else 1440

random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = 24
sc.frame_start, sc.frame_end = 1, 1440
col = sc.collection

# ---------------------------------------------------------------- helpers
def mat(name, c, rough=0.6, noise=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    b.inputs["Roughness"].default_value = rough
    if noise:
        tex = nt.nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = noise[1]
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.elements[0].color = (*c, 1)
        ramp.color_ramp.elements[1].color = (*noise[0], 1)
        nt.links.new(tex.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    else:
        b.inputs["Base Color"].default_value = (*c, 1)
    return m

def prim(kind, loc=(0, 0, 0), scale=(1, 1, 1), rot=(0, 0, 0), m=None, parent=None, smooth=True, **kw):
    if kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=loc, **kw)
    elif kind == "cyl":
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, location=loc, **kw)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(vertices=20, location=loc, **kw)
    elif kind == "cube":
        bpy.ops.mesh.primitive_cube_add(location=loc, **kw)
        smooth = False
    elif kind == "torus":
        bpy.ops.mesh.primitive_torus_add(location=loc, **kw)
    elif kind == "plane":
        bpy.ops.mesh.primitive_plane_add(location=loc, **kw)
        smooth = False
    o = bpy.context.object
    o.scale = scale
    o.rotation_euler = rot
    if m:
        o.data.materials.append(m)
    if smooth:
        bpy.ops.object.shade_smooth()
    if parent:
        o.parent = parent
    return o

def empty(name, loc=(0, 0, 0), parent=None):
    o = bpy.data.objects.new(name, None)
    col.objects.link(o)
    o.location = loc
    o.parent = parent
    return o

def lerp(a, b, t):
    return a + (b - a) * t

def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)

def interp(keys, f):
    """keys: list of (frame, *values). Smooth-step between keys."""
    if f <= keys[0][0]:
        return keys[0][1:]
    for k0, k1 in zip(keys, keys[1:]):
        if k0[0] <= f <= k1[0]:
            t = (f - k0[0]) / max(1e-6, (k1[0] - k0[0]))
            return tuple(lerp(a, b, t) for a, b in zip(k0[1:], k1[1:]))
    return keys[-1][1:]

def vis(o, ranges):
    """Show object only during given frame ranges (list of (a,b)); applies to children too."""
    objs = [o] + list(o.children_recursive)
    for ob in objs:
        on = lambda f: any(a <= f <= b for a, b in ranges)
        prev = None
        for f in range(1, 1442):
            v = on(f)
            if v != prev:
                ob.hide_render = not v
                ob.hide_viewport = not v
                ob.keyframe_insert("hide_render", frame=f)
                ob.keyframe_insert("hide_viewport", frame=f)
                prev = v

# ---------------------------------------------------------------- materials
WHITE = mat("goatwhite", (0.88, 0.86, 0.82), 0.7)
BROWN = mat("patch", (0.22, 0.1, 0.04), 0.7)
BLACK = mat("black", (0.005, 0.005, 0.005), 0.15)
EYEW = mat("eyewhite", (1, 1, 1), 0.2)
RED = mat("red", (0.75, 0.02, 0.02), 0.4)
GOLD = mat("gold", (0.85, 0.55, 0.08), 0.25)
PINK = mat("pink", (0.85, 0.35, 0.38), 0.5)
HORN = mat("horn", (0.5, 0.4, 0.3), 0.5)
HOOF = mat("hoof", (0.12, 0.08, 0.06), 0.5)
SKIN = mat("skin", (0.5, 0.28, 0.16), 0.55)
KAMEEZ = mat("kameez", (0.55, 0.4, 0.24), 0.8)
TURBAN = mat("turban", (0.93, 0.93, 0.9), 0.8)
BEARD = mat("beard", (0.9, 0.9, 0.88), 0.9)
SANDAL = mat("sandal", (0.18, 0.08, 0.03), 0.6)
CANM = mat("can", (0.08, 0.42, 0.14), 0.35)
GRASS = mat("grass", (0.1, 0.32, 0.05), 0.9, noise=((0.2, 0.45, 0.08), 3.0))
DIRT = mat("dirt", (0.42, 0.28, 0.15), 0.95, noise=((0.5, 0.36, 0.2), 6.0))
SOIL = mat("soil", (0.17, 0.09, 0.04), 0.95, noise=((0.24, 0.13, 0.06), 8.0))
CARROT = mat("carrot", (0.95, 0.32, 0.02), 0.5)
LEAF = mat("leaf", (0.12, 0.5, 0.06), 0.6)
WOOD = mat("wood", (0.32, 0.18, 0.07), 0.8)
MUD = mat("mud", (0.6, 0.42, 0.24), 0.95, noise=((0.52, 0.35, 0.19), 4.0))
ROOF = mat("roof", (0.35, 0.22, 0.12), 0.9)
DOOR = mat("door", (0.15, 0.25, 0.4), 0.6)
TRUNK = mat("trunk", (0.2, 0.12, 0.06), 0.9)
CANOPY = mat("canopy", (0.06, 0.25, 0.04), 0.8, noise=((0.12, 0.38, 0.06), 5.0))
HAY = mat("hay", (0.8, 0.62, 0.18), 0.9, noise=((0.65, 0.48, 0.1), 12.0))
MUSTARD = mat("mustard", (0.85, 0.7, 0.02), 0.8, noise=((0.3, 0.45, 0.05), 6.0))
ROPE = mat("rope", (0.72, 0.56, 0.3), 0.9)
FLOWER = mat("flower", (0.95, 0.85, 0.2), 0.5)
FLOWER2 = mat("flower2", (0.9, 0.3, 0.5), 0.5)
ROCK = mat("rock", (0.4, 0.38, 0.35), 0.9)

# ---------------------------------------------------------------- world & light
world = bpy.data.worlds.new("sky")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
sky = world.node_tree.nodes.new("ShaderNodeTexSky")
sky.sky_type = "PREETHAM"
sky.sun_direction = Vector((0.4, -0.5, 0.6)).normalized()
sky.turbidity = 2.5
world.node_tree.links.new(sky.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 0.9

bpy.ops.object.light_add(type="SUN", rotation=(math.radians(50), math.radians(10), math.radians(-40)))
sun = bpy.context.object
sun.data.energy = 4.2
sun.data.color = (1.0, 0.9, 0.75)
sun.data.angle = math.radians(4)

# ---------------------------------------------------------------- environment
prim("plane", (0, 0, 0), (60, 60, 1), m=GRASS)
prim("plane", (-8, 0, 0.004), (9, 0.75, 1), m=DIRT)
prim("plane", (8, 0, 0.004), (3, 0.75, 1), m=DIRT)
prim("plane", (3, 0, 0.006), (2, 1.6, 1), m=SOIL)
prim("plane", (0, 16, 0.01), (25, 5, 1), m=MUSTARD)

# carrots in the garden
carrots = []
for gx in [1.6 + 0.4 * i for i in range(8)]:
    for gy in [-1.2, -0.6, 0.0, 0.6, 1.2]:
        root = empty("carrot", (gx + random.uniform(-0.05, 0.05), gy + random.uniform(-0.05, 0.05), 0))
        prim("cone", (0, 0, 0.03), (1, 1, 1), (math.pi, 0, 0), m=CARROT, parent=root, radius1=0.055, radius2=0.01, depth=0.1)
        for k in range(4):
            a = k * math.pi / 2 + random.uniform(-0.3, 0.3)
            prim("cone", (0.04 * math.cos(a), 0.04 * math.sin(a), 0.16), (0.6, 0.6, 1), (0.35 * math.sin(a) * -1, 0.35 * math.cos(a), 0),
                 m=LEAF, parent=root, radius1=0.035, radius2=0.0, depth=0.26)
        carrots.append(root)

# fence around garden x 1..5, y -1.7..1.7 with a gap on the west side and a gate on the east
fence_objs = []
def stick(x, y):
    fence_objs.append(prim("cyl", (x, y, 0.36), m=WOOD, radius=0.03, depth=0.72))
def rail(p0, p1, z):
    p0, p1 = Vector((*p0, z)), Vector((*p1, z))
    mid = (p0 + p1) / 2
    d = p1 - p0
    o = prim("cyl", mid, m=WOOD, radius=0.018, depth=d.length)
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()

xs = [1 + 0.25 * i for i in range(17)]
ys = [-1.7 + 0.25 * i for i in range(14)] + [1.7]
for x in xs:
    stick(x, -1.7); stick(x, 1.7)
for y in ys:
    if not abs(y) < 0.3:
        stick(1.0, y)
    if not abs(y) < 0.45:
        stick(5.0, y)
for z in (0.25, 0.55):
    rail((1, -1.7), (5, -1.7), z); rail((1, 1.7), (5, 1.7), z)
    rail((1, -1.7), (1, -0.3), z); rail((1, 0.3), (1, 1.7), z)
    rail((5, -1.7), (5, -0.45), z); rail((5, 0.45), (5, 1.7), z)
# open gate leaf
gate = prim("cube", (5.35, 0.45 + 0.02, 0.35), (0.38, 0.02, 0.3), m=WOOD)
gate.rotation_euler = (0, 0, math.radians(70))
gate.location = (5.0 + 0.38 * math.cos(math.radians(70)), 0.45 + 0.38 * math.sin(math.radians(70)), 0.35)

# mud houses
def house(x, y, sx, sy, h, rotz=0):
    hb = empty("house", (x, y, 0))
    hb.rotation_euler = (0, 0, rotz)
    prim("cube", (0, 0, h / 2), (sx, sy, h / 2), m=MUD, parent=hb)
    prim("cube", (0, 0, h + 0.05), (sx + 0.15, sy + 0.15, 0.06), m=ROOF, parent=hb)
    prim("cube", (0, -sy - 0.01, 0.75), (0.38, 0.03, 0.75), m=DOOR, parent=hb)
    prim("cube", (sx * 0.6, -sy - 0.01, 1.4), (0.28, 0.03, 0.25), m=DOOR, parent=hb)
house(-3, 5.5, 2.2, 1.5, 2.6)
house(-10, 6.5, 1.8, 1.4, 2.3)
house(7.5, 6, 2.0, 1.4, 2.4)

# neem trees
def tree(x, y, s=1.0):
    t = empty("tree", (x, y, 0))
    t.scale = (s, s, s)
    prim("cyl", (0, 0, 1.3), m=TRUNK, parent=t, radius=0.18, depth=2.6)
    for k in range(7):
        a = k * 2 * math.pi / 7
        r = 0.9 if k else 0
        prim("sphere", (r * math.cos(a), r * math.sin(a), 3.0 + random.uniform(-0.3, 0.4)),
             (1.1, 1.1, 0.9), m=CANOPY, parent=t, radius=1.0)
tree(-6.5, 2.8, 1.1)
tree(9, 3.5, 1.0)
tree(-14, 3, 1.2)
tree(4, 9, 1.3)

# charpai under the tree
cp = empty("charpai", (-6.6, 1.6, 0))
prim("cube", (0, 0, 0.42), (0.95, 0.45, 0.04), m=ROPE, parent=cp)
for sx in (-1, 1):
    prim("cube", (0, sx * 0.47, 0.42), (1.0, 0.04, 0.06), m=WOOD, parent=cp)
    prim("cube", (sx * 0.98, 0, 0.42), (0.04, 0.5, 0.06), m=WOOD, parent=cp)
    for sy in (-1, 1):
        prim("cyl", (sx * 0.95, sy * 0.45, 0.22), m=WOOD, parent=cp, radius=0.04, depth=0.45)

# hay pile on the path
hay = prim("sphere", (-4.0, 0.0, 0.0), (0.7, 0.6, 0.32), m=HAY)

# scattered flowers and rocks
for _ in range(90):
    x, y = random.uniform(-16, 14), random.uniform(-8, 10)
    if (0.6 < x < 5.4 and -2 < y < 2) or abs(y) < 0.9:
        continue
    prim("sphere", (x, y, 0.04), (1, 1, 0.7), m=random.choice([FLOWER, FLOWER2]), radius=0.05)
for _ in range(25):
    x, y = random.uniform(-16, 14), random.uniform(-8, 8)
    if (0.6 < x < 5.4 and -2 < y < 2) or abs(y) < 0.9:
        continue
    prim("sphere", (x, y, 0.0), (1.4, 1, 0.6), m=ROCK, radius=random.uniform(0.08, 0.2))

# ---------------------------------------------------------------- goat Chamki (faces +x)
goat = empty("goat")
gbody = empty("gbody", (0, 0, 0), goat)
prim("sphere", (0, 0, 0.55), (0.45, 0.27, 0.28), m=WHITE, parent=gbody)
neck = empty("neck", (0.3, 0, 0.66), gbody)
prim("cyl", (0.04, 0, 0.06), (1, 1, 1), (0, math.radians(40), 0), m=WHITE, parent=neck, radius=0.1, depth=0.32)
collar = prim("torus", (0.01, 0, 0.0), (1, 1, 1), (0, math.radians(40), 0), m=RED, parent=neck, major_radius=0.115, minor_radius=0.025)
prim("sphere", (0.07, 0, -0.12), m=GOLD, parent=neck, radius=0.04)
head = empty("head", (0.13, 0, 0.17), neck)
prim("sphere", (0, 0, 0), (0.19, 0.155, 0.165), m=WHITE, parent=head)
prim("sphere", (0.15, 0, -0.05), (0.11, 0.095, 0.085), m=WHITE, parent=head)
prim("sphere", (0.245, 0, -0.035), (0.02, 0.05, 0.025), m=PINK, parent=head)
prim("sphere", (0.07, 0.115, 0.06), (0.075, 0.045, 0.075), m=BROWN, parent=head)  # patch around left eye
for s in (1, -1):
    prim("sphere", (0.11, 0.1 * s, 0.055), m=EYEW, parent=head, radius=0.048)
    prim("sphere", (0.148, 0.112 * s, 0.06), m=BLACK, parent=head, radius=0.027)
    prim("sphere", (0.168, 0.118 * s, 0.075), m=EYEW, parent=head, radius=0.007)
    prim("sphere", (-0.03, 0.19 * s, 0.07), (0.045, 0.12, 0.025), (0.35 * s, 0, 0), m=WHITE, parent=head)
    prim("cone", (-0.04, 0.065 * s, 0.19), (1, 1, 1), (0, math.radians(-35), 0), m=HORN, parent=head,
         radius1=0.036, radius2=0.006, depth=0.2)
mouth_carrot = prim("cone", (0.27, 0.05, -0.07), (1, 1, 1), (0, 0, math.radians(70)), m=CARROT, parent=head,
                    radius1=0.035, radius2=0.008, depth=0.16)
mouth_carrot.rotation_euler = (math.radians(90), 0, math.radians(60))
legs = {}
for name, (x, y) in {"fl": (0.28, 0.13), "fr": (0.28, -0.13), "bl": (-0.28, 0.13), "br": (-0.28, -0.13)}.items():
    hip = empty("hip_" + name, (x, y, 0.45), gbody)
    prim("cyl", (0, 0, -0.2), m=WHITE, parent=hip, radius=0.045, depth=0.4)
    prim("cyl", (0, 0, -0.415), m=HOOF, parent=hip, radius=0.05, depth=0.05)
    legs[name] = hip
tail = empty("tail", (-0.43, 0, 0.68), gbody)
prim("sphere", (-0.03, 0, 0.05), (0.06, 0.04, 0.09), (0, -0.5, 0), m=WHITE, parent=tail)

# ---------------------------------------------------------------- Chacha Karim (faces +x)
karim = empty("karim")
kb = empty("kbody", (0, 0, 0), karim)
khips = {}
for s in (1, -1):
    hp = empty("khip", (0, 0.1 * s, 0.82), kb)
    prim("cyl", (0, 0, -0.4), m=TURBAN, parent=hp, radius=0.085, depth=0.8)
    prim("cube", (0.05, 0, -0.8), (0.12, 0.06, 0.03), m=SANDAL, parent=hp)
    khips[s] = hp
prim("cone", (0, 0, 1.1), (1, 1.1, 1), m=KAMEEZ, parent=kb, radius1=0.3, radius2=0.2, depth=0.85)
prim("sphere", (0, 0, 1.5), (0.22, 0.24, 0.12), m=KAMEEZ, parent=kb)
khead = empty("khead", (0, 0, 1.74), kb)
prim("sphere", (0, 0, 0), m=SKIN, parent=khead, radius=0.165)
prim("sphere", (0.155, 0, -0.01), (1, 0.9, 1.1), m=SKIN, parent=khead, radius=0.04)
brows = []
for s in (1, -1):
    prim("sphere", (0.135, 0.062 * s, 0.03), m=EYEW, parent=khead, radius=0.03)
    prim("sphere", (0.158, 0.064 * s, 0.032), m=BLACK, parent=khead, radius=0.017)
    brows.append(prim("sphere", (0.15, 0.065 * s, 0.085), (0.018, 0.045, 0.012), m=BEARD, parent=khead))
prim("sphere", (0.07, 0, -0.13), (0.13, 0.15, 0.13), m=BEARD, parent=khead)
prim("sphere", (0.155, 0, -0.055), (0.03, 0.085, 0.02), m=BEARD, parent=khead)
prim("torus", (0, 0, 0.12), m=TURBAN, parent=khead, major_radius=0.14, minor_radius=0.065)
prim("sphere", (0, 0, 0.17), (0.16, 0.16, 0.1), m=TURBAN, parent=khead)
karms = {}
for s in (1, -1):
    sh = empty("kshoulder", (0, 0.29 * s, 1.47), kb)
    prim("cyl", (0, 0, -0.3), m=KAMEEZ, parent=sh, radius=0.065, depth=0.6)
    prim("sphere", (0, 0, -0.63), m=SKIN, parent=sh, radius=0.07)
    karms[s] = sh
can = empty("can_in_hand", (0.08, 0, -0.75), karms[-1])
prim("cyl", (0, 0, 0), m=CANM, parent=can, radius=0.1, depth=0.2)
prim("cyl", (0.16, 0, 0.06), (1, 1, 1), (0, math.radians(55), 0), m=CANM, parent=can, radius=0.018, depth=0.22)
hand_carrot = prim("cone", (0.1, 0, -0.66), (1, 1, 1), (0, math.radians(90), 0), m=CARROT, parent=karms[1],
                   radius1=0.035, radius2=0.008, depth=0.18)
ground_can = empty("ground_can", (2.45, 1.35, 0.1))
prim("cyl", (0, 0, 0), m=CANM, parent=ground_can, radius=0.1, depth=0.2)
prim("cyl", (0.16, 0, 0.06), (1, 1, 1), (0, math.radians(55), 0), m=CANM, parent=ground_can, radius=0.018, depth=0.22)

# ---------------------------------------------------------------- goat motion
# (frame, x, y, z, heading_deg)
G = [
    (1, -12, 0, 0, 0), (110, -5.3, 0, 0, 0), (132, -4.75, 0, 0, 0),
    (150, -4.05, 0, 0.27, 0), (205, -4.05, 0, 0.27, 0), (222, -3.25, 0, 0, 0),
    (300, -0.25, 0, 0, 0), (378, -0.25, 0, 0, 0), (388, -0.25, 0, 0, 25), (398, -0.25, 0, 0, -25),
    (408, -0.25, 0, 0, 0), (425, 0.35, 0, -0.13, 0), (465, 1.55, 0, -0.13, 0), (482, 1.85, 0, 0, 0),
    (498, 2.0, 0, 0, 0), (600, 2.0, 0, 0, 0), (640, 3.0, 0.6, 0, 30), (680, 3.75, -0.15, 0, -45),
    (715, 4.0, -0.6, 0, -60), (848, 4.0, -0.6, 0, -60), (858, 4.0, -0.6, 0, 170), (872, 3.85, -0.5, 0, 172),
    (958, 1.38, 0.62, 0, 180), (1168, 1.38, 0.62, 0, 180), (1192, 1.85, 0.55, 0, 180),
    (1210, 1.85, 0.55, 0, 73), (1318, 1.85, 0.55, 0, 73), (1335, 2.1, 0.45, 0, 0), (1440, 4.75, 0.3, 0, 0),
]
HOPS = [(1, 110), (132, 150), (205, 222), (222, 300), (600, 715), (858, 872), (872, 958)]
JUMP_ARC = {(132, 150): 0.35, (205, 222): 0.3, (858, 872): 0.3}
MUNCH = [(500, 600), (615, 635), (655, 675), (690, 712), (722, 845), (1282, 1316)]
WIGGLE = (960, 1168)

def goat_state(f):
    x, y, z, h = interp(G, f)
    x2, y2, _, _ = interp(G, f + 1)
    speed = math.hypot(x2 - x, y2 - y)
    hop = 0.0
    for a, b in HOPS:
        if a <= f <= b:
            if (a, b) in JUMP_ARC:
                hop = JUMP_ARC[(a, b)] * math.sin(math.pi * (f - a) / (b - a))
            else:
                hop = 0.12 * abs(math.sin(f * 0.45))
    return x, y, z + hop, h, speed

goat_head_pos = {}
for f in range(1, 1441):
    x, y, z, h, speed = goat_state(f)
    wig = 0.0
    if WIGGLE[0] <= f <= WIGGLE[1]:
        wig = math.sin(f * 0.6) * (8 if f < 1080 else 4)
        x += 0.03 * math.sin(f * 0.9)
    goat.location = (x, y, max(0.0, z))
    goat.rotation_euler = (0, 0, math.radians(h + wig))
    goat.keyframe_insert("location", frame=f)
    goat.keyframe_insert("rotation_euler", frame=f)
    gbody.location = (0, 0, min(0.0, z))
    gbody.keyframe_insert("location", frame=f)
    # legs
    amp = min(0.7, speed * 9)
    ph = f * 0.5
    for name, hip in legs.items():
        off = 0 if name in ("fl", "br") else math.pi
        a = amp * math.sin(ph + off)
        if 160 <= f <= 200 and name in ("bl", "br"):
            a = -0.9 * abs(math.sin((f - 160) * 0.35))  # playful back kick
        if WIGGLE[0] <= f <= WIGGLE[1]:
            a = 0.25 * math.sin(f * 0.9 + off)
        hip.rotation_euler = (0, -a, 0)
        hip.keyframe_insert("rotation_euler", frame=f)
    # neck / head
    pitch = 0.0
    yaw = 0.0
    for a, b in MUNCH:
        if a <= f <= b:
            pitch = 0.55 + 0.12 * math.sin(f * 0.8)
    if 300 <= f <= 378:   # stares at carrots, head tilt
        yaw = 0.0
        pitch = -0.1
        head.rotation_euler = (math.radians(12) * smooth((f - 300) / 20), 0, 0)
    elif 1210 <= f <= 1262:  # ashamed
        pitch = 0.5 * smooth((f - 1210) / 12)
    elif 958 <= f <= 1168:
        pitch = 0.15
    if not (300 <= f <= 378):
        head.rotation_euler = (0, 0, 0)
    head.keyframe_insert("rotation_euler", frame=f)
    neck.rotation_euler = (0, pitch, yaw)
    neck.keyframe_insert("rotation_euler", frame=f)
    tail.rotation_euler = (0, 0, 0.6 * math.sin(f * 0.7))
    tail.keyframe_insert("rotation_euler", frame=f)
    # approximate head position in world for eating carrots
    hr = math.radians(h)
    goat_head_pos[f] = (x + 0.62 * math.cos(hr), y + 0.62 * math.sin(hr))

vis(mouth_carrot, [(505, 600), (1292, 1330)])

# carrots get eaten during part 2 (frames 470-720) and stay gone
for c in carrots:
    cx, cy = c.location.x, c.location.y
    eaten = None
    for f in range(470, 721):
        hx, hy = goat_head_pos[f]
        if math.hypot(hx - cx, hy - cy) < 0.28:
            eaten = f
            break
    if eaten:
        vis(c, [(1, eaten)])
        # scattered leaves and a half-eaten bit appear where it was
        bit = empty("bits", (cx, cy, 0))
        for k in range(3):
            a = random.uniform(0, 2 * math.pi)
            r = random.uniform(0.05, 0.25)
            prim("cone", (r * math.cos(a), r * math.sin(a), 0.015), (0.6, 0.6, 1),
                 (math.radians(90), 0, random.uniform(0, 6.28)), m=LEAF, parent=bit, radius1=0.03, radius2=0, depth=0.22)
        prim("cone", (0.08, -0.05, 0.03), (1, 1, 1), (math.radians(90), 0, random.uniform(0, 6.28)), m=CARROT,
             parent=bit, radius1=0.035, radius2=0.008, depth=0.09)
        vis(bit, [(eaten, 1441)])

# hay kicked into the air
for k in range(14):
    p = prim("cube", (-4.2, 0, 0.3), (0.05, 0.012, 0.012), m=HAY)
    vx, vy, vz = random.uniform(-1.6, -0.6), random.uniform(-0.8, 0.8), random.uniform(1.5, 3.0)
    rx = random.uniform(-10, 10)
    t0 = 162 + random.randint(0, 30)
    for f in range(t0, t0 + 30):
        t = (f - t0) / 24
        z = 0.3 + vz * t - 4.9 * t * t
        p.location = (-4.2 + vx * t, vy * t, max(0.02, z))
        p.rotation_euler = (rx * t, rx * 0.5 * t, 0)
        p.keyframe_insert("location", frame=f)
        p.keyframe_insert("rotation_euler", frame=f)
    vis(p, [(t0, 1441)])

# ---------------------------------------------------------------- Karim motion
K = [
    (1, 9.5, 0, 180, 0), (721, 9.0, 0, 180, 0), (818, 5.6, 0, 180, 0), (1085, 5.6, 0, 180, 0),
    (1150, 2.1, 1.08, 163, 0), (1160, 2.1, 1.08, 216, 0), (1175, 2.1, 1.08, 216, 1), (1303, 2.1, 1.08, 216, 1),
    (1318, 2.1, 1.08, 216, 0), (1330, 2.15, 1.0, 0, 0), (1440, 4.9, 0.85, 0, 0),
]
WALK_K = [(721, 818), (1085, 1150), (1330, 1440)]
for f in range(1, 1441):
    x, y, h, kneel = interp(K, f)
    walking = any(a <= f <= b for a, b in WALK_K)
    bob = 0.025 * abs(math.sin(f * 0.35)) if walking else 0
    karim.location = (x, y, 0)
    karim.rotation_euler = (0, 0, math.radians(h))
    karim.keyframe_insert("location", frame=f)
    karim.keyframe_insert("rotation_euler", frame=f)
    kb.location = (0, 0, bob - 0.42 * kneel)
    kb.keyframe_insert("location", frame=f)
    sw = 0.45 * math.sin(f * 0.35) if walking else 0
    for s, hp in khips.items():
        bend = -1.2 * kneel
        hp.rotation_euler = (0, sw * s + bend, 0)
        hp.keyframe_insert("rotation_euler", frame=f)
    # arms: default swing
    ar = {1: (0, -sw * 0.8, 0), -1: (0, sw * 0.8, 0)}
    if 822 <= f <= 870:  # surprised, arms up and out
        t = smooth((f - 822) / 8) * (1 - smooth((f - 860) / 10))
        ar = {1: (1.9 * t, -0.3 * t, 0), -1: (-1.9 * t, -0.3 * t, 0)}
    if 1170 <= f <= 1200:  # both hands to the fence
        t = smooth((f - 1170) / 8) * (1 - smooth((f - 1192) / 8))
        ar = {1: (0, -1.3 * t, 0), -1: (0, -1.3 * t, 0)}
    if 1215 <= f <= 1252:  # pats goat with right hand
        t = smooth((f - 1215) / 6) * (1 - smooth((f - 1246) / 6))
        ar[-1] = (0, -(1.1 + 0.15 * math.sin(f * 0.9)) * t, 0)
    if 1255 <= f <= 1300:  # offers carrot with left hand
        t = smooth((f - 1255) / 8) * (1 - smooth((f - 1292) / 8))
        ar[1] = (0, -1.25 * t, 0)
    for s, shl in karms.items():
        shl.rotation_euler = ar[s]
        shl.keyframe_insert("rotation_euler", frame=f)
    up = 0.03 * smooth((f - 822) / 6) * (1 - smooth((f - 870) / 10)) if 822 <= f <= 880 else 0
    for b, s in zip(brows, (1, -1)):
        b.location = (0.15, 0.065 * s, 0.085 + up)
        b.keyframe_insert("location", frame=f)
    khead.rotation_euler = (0, 0.25 * smooth((f - 1205) / 10) if 1205 <= f <= 1300 else 0, 0)
    khead.keyframe_insert("rotation_euler", frame=f)

vis(can, [(1, 1150)])
vis(karim, [(700, 1441)])
vis(ground_can, [(1151, 1441)])
vis(hand_carrot, [(1250, 1291)])

# ---------------------------------------------------------------- cameras
markers = sc.timeline_markers
def goat_at(f, dz=0.5):
    x, y, z, h, _ = goat_state(f)
    return (x, y, max(0, z) + dz)

def shot(name, f0, f1, cam_fn, tgt_fn, lens0=35, lens1=None):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens0
    cd.dof.use_dof = False
    cam = bpy.data.objects.new(name, cd)
    col.objects.link(cam)
    tgt = empty(name + "_t")
    con = cam.constraints.new("TRACK_TO")
    con.target = tgt
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    for f in range(f0, f1 + 1, 2):
        t = (f - f0) / max(1, f1 - f0)
        cam.location = cam_fn(f, t)
        tgt.location = tgt_fn(f, t)
        cam.keyframe_insert("location", frame=f)
        tgt.keyframe_insert("location", frame=f)
        if lens1:
            cd.lens = lerp(lens0, lens1, t)
            cd.keyframe_insert("lens", frame=f)
    m = markers.new(name, frame=f0)
    m.camera = cam
    return cam

V = lambda *a: Vector(a)
shot("s1a", 1, 120, lambda f, t: V(goat_at(f)[0] + 0.8, -3.6 + 0.6 * t, 1.0), lambda f, t: V(goat_at(f)[0] + 0.5, 0, 0.55), 32)
shot("s1b", 121, 240, lambda f, t: V(-2.4, -2.5, 0.95), lambda f, t: V(-4.0, 0, 0.75), 38)
shot("s1c", 241, 360, lambda f, t: V(goat_at(f)[0] - 1.5, -0.7, 1.15), lambda f, t: V(lerp(2.0, 3.0, t), 0, 0.25), 32, 45)
shot("s2a", 361, 480, lambda f, t: V(0.2, -2.4, 0.55), lambda f, t: V(lerp(-0.1, 1.4, smooth(t)), 0, 0.4), 32)
shot("s2b", 481, 600, lambda f, t: V(lerp(3.2, 2.95, t), lerp(-1.5, -1.15, t), 0.7), lambda f, t: V(2.45, 0, 0.45), 42, 50)
shot("s2c", 601, 720, lambda f, t: V(3.0, lerp(-4.2, -6.2, t), lerp(2.0, 3.3, t)), lambda f, t: V(3.1, 0, 0.2), 32)
shot("s3a", 721, 850, lambda f, t: V(2.0, -1.9, 1.25), lambda f, t: V(5.0, -0.1, 0.9), 28)
shot("s3b", 851, 960, lambda f, t: V(2.9, -3.3, 1.2), lambda f, t: V(*goat_at(f, 0.45)), 32)
shot("s3c", 961, 1080, lambda f, t: V(lerp(-0.8, -0.45, t), lerp(1.55, 1.3, t), 0.85), lambda f, t: V(1.0, 0.62, 0.68), 38)
shot("s4a", 1081, 1200, lambda f, t: V(-0.6, 2.9, 1.5), lambda f, t: V(lerp(2.6, 1.8, smooth(t)), 0.8, 0.75), 28)
shot("s4b", 1201, 1320, lambda f, t: V(lerp(3.6, 3.3, t), lerp(-1.4, -1.1, t), 1.55), lambda f, t: V(1.95, 0.8, 0.8), 26, 30)
shot("s4c", 1321, 1440, lambda f, t: V(lerp(6.8, 8.6, t), lerp(-3.0, -5.5, t), lerp(1.4, 4.2, t)),
     lambda f, t: V(lerp(2.8, 4.6, t), 0.55, 0.6), 30)

for ob in bpy.data.objects:
    if ob.animation_data and ob.animation_data.action:
        for fc in ob.animation_data.action.fcurves:
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"
            if fc.data_path.startswith("hide"):
                for kp in fc.keyframe_points:
                    kp.interpolation = "CONSTANT"
# camera cuts: keep marker binding; set active camera
sc.camera = bpy.data.objects["s1a"]

# ---------------------------------------------------------------- render settings
sc.render.engine = "BLENDER_EEVEE"
e = sc.eevee
e.taa_render_samples = 12
e.use_gtao = True
e.gtao_distance = 0.6
e.use_soft_shadows = True
e.shadow_cube_size = "1024"
e.shadow_cascade_size = "2048"
e.use_bloom = True
e.bloom_intensity = 0.03
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Punchy"
sun.data.shadow_cascade_max_distance = 40
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = "PNG"
sc.render.filepath = OUT.rstrip("/") + "/f_"
sc.frame_start, sc.frame_end = FSTART, FEND
if len(argv) > 3 and argv[3] == "test":
    for f in range(FSTART, FEND + 1, 120):
        sc.frame_set(f)
        sc.render.filepath = OUT.rstrip("/") + "/test_%04d.png" % f
        bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
