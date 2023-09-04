import { Link, useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'


const schema = z.object({
  email: z.string().email('Insira um email válido').nonempty("O campo email é obrigatorio"),
  password: z.string().nonempty('O campo senha é obrigatorio')
})

type FormData = z.infer<typeof schema>

export function Login() {
  const navegate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() =>{
    async function handleLogout(){
      await signOut(auth)
    }
    handleLogout()
  },[])

  function onSubmit(data: FormData) {
    signInWithEmailAndPassword(auth, data.email, data.password).then((user) =>{
      console.log("LOGADO COM SUCESSO")
      console.log(user)
      toast.success("Logado com sucesso!")
      navegate("/dashboard", {replace: true})
    }).catch( err => {
      console.log("ERRO AO LOGAR")
      console.log(err)
      toast.error("Erro ao fazer o login!")
    })
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img className="w-full" src={logoImg} alt="Logo do site" />
        </Link>

        <form className="bg-white max-w-xl rounded-lg" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Input error={errors.email?.message} register={register}
              type="email" placeholder="Digite seu email..." name="email"
            />
          </div>

          <div className="mb-3">
            <Input error={errors.password?.message} register={register}
              type="password" placeholder="Digite sua senha..." name="password"
            />
          </div>

          <button type="submit" className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">Acessar</button>
        </form>
        <Link to="/register">
          Ainda não possui uma conta? Cadastre-se!
        </Link>
      </div>
    </Container>
  )
}