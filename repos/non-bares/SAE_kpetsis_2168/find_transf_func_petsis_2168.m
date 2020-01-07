function y = find_transf_func_petsis_2168()
  pkg load control 
  s = tf('s')
  G = (s+2)/(s+4)
  H = 1/(s+2)
  y = G/(1+G*H)
  bode(y)
end