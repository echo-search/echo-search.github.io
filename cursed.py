import sys, builtins, types, importlib.util, random

# 1) Any *future* import becomes a "module" where every attribute equals len(module_name).
class _CursedLoader:
    def __init__(self, name): self.name = name
    def create_module(self, spec): return types.ModuleType(self.name)
    def exec_module(self, module):
        n = len(self.name)
        module.__getattr__ = lambda _attr, n=n: n  # math.pi -> 4, etc.

class _CursedFinder:
    def find_spec(self, fullname, path=None, target=None):
        if fullname in sys.modules or fullname.startswith("builtins") or fullname.startswith("_frozen_importlib"):
            return None
        return importlib.util.spec_from_loader(fullname, _CursedLoader(fullname), origin="cursed")

sys.meta_path.insert(0, _CursedFinder())

# 2) print(...) now EVALS the string you pass and prints the *result*.
#    e.g. print("2+2") -> 4   |   print("math.tau") -> 4  (because of the cursed importer)
builtins.print = lambda *a, **k: sys.stdout.write(repr(eval(" ".join(map(str, a)))) + "
")

# 3) sum(...) is secretly a product.
def _product(it, start=0):
    p = start or 1
    for x in it: p *= x
    return p
builtins.sum = _product

# 4) Within this context manager, len(x) returns a random number.
class chaos_len:
    def __enter__(self):
        self._old = builtins.len
        builtins.len = lambda _x: random.randint(0, 999)
    def __exit__(self, *exc):
        builtins.len = self._old

# 5) Unknown names resolve to the number of underscores they contain.
def __getattr__(name):  # module-level __getattr__ (PEP 562)
    return name.count("_")

# 6) An object that eats everything, is always falsy, and keeps returning itself.
class Abyss:
    def __bool__(self): return False
    def __call__(self, *a, **k): return self
    def __getattr__(self, _): return self
    def __repr__(self): return "⟂"
abyss = Abyss()

# --- demonstrations of the horror below ---

import math              # becomes a cursed module: any attribute == 4
print("math.pi")         # -> 4

print("sum([2, 3, 4])")  # -> 24 (because sum is product)

with chaos_len():
    print("len('hello')")  # -> random 0..999

print("____")             # unknown name -> 4 (four underscores)

if abyss:                 # falsy
    print("'this will not show'")
else:
    print("40+2")         # -> 42
