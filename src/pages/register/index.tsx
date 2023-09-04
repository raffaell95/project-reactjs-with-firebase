import { Link, useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'


const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório'),
  email: z.string().email('Insira um email válido').nonempty("O campo email é obrigatorio"),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').nonempty('O campo senha é obrigatorio')
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { handleInfoUser } = useContext(AuthContext)
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
    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async (user) =>{
      await updateProfile(user.user, {
        displayName: data.name
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.user.uid
      })
      console.log('CADASTRADO COM SUCESSO')
      toast.success("Bem vindo ao webcarros!")
      navegate("/dashboard", {replace: true})
    }).catch((error) => {
      console.log("ERRO AO CADASTRAR ESTE USUARIO")
      console.log(error)
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
            <Input error={errors.name?.message} register={register}
              type="name" placeholder="Digite seu nome completo..." name="name"
            />
          </div>

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

          <button type="submit" className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium">Cadastrar</button>
        </form>

        <Link to="/login">
          Já possui uma conta? Faça o login!
        </Link>
      </div>
    </Container>
  )
}